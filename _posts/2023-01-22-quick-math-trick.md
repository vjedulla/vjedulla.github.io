---
layout: post
title: Quick, a math trick!
subtitle: Moving average in a streaming context.
date:   2023-01-21
tags: [quickie, jupyter, linear-algebra]
readtime: True
---

Moving averages are an important metric in many contexts. What is it used for? In a lot of streams of data where 
you get data every x milliseconds and need to compute the moving average of the current "buffer" or window size.
How would you compute a moving average quickly?
Easy! There it is:

{% highlight python linenos %}
import numpy as np
import pandas as pd

window_size = 7
values = np.array([1, 2, 3, 4, 5, 6, 7])

data = pd.DataFrame(values, columns=['x'])
data['moving_avg'] = data['x'].rolling(window_size, min_periods=0).mean()
# output data['moving_avg'].values: array([1. , 1.5, 2. , 2.5, 3. , 3.5, 4. ])
{% endhighlight %}


Notice that if we do not supply the `min_periods=0` parameter we are going to get `np.NaN` for the first
`window_size-1` values. That is to say that until we can see at least `window_size` values, we cannot compute
the mean. That is simple an easy implementation. Can we implement something similar in numpy library. 
Look at the following example:




Lets explore what is happening with this code. There are 2 components of this code that I would like to 
discuss:
1. Tril function - returns the triangular lower form of an array, and puts 0s in the upper part
2. `@` operator - this is shorthand for `np.matmul`

But what exactly is the matrix multiplication has to do with moving averages. Given the definition we 
multiply each row of the first matrix with the column of the next matrix. However, when the first matrix 
is full of ones we end up doing:

{% highlight python linenos %}
import numpy as np

window_size = 7
window = np.tril(np.ones((window_size, window_size)))
# array([[1., 0., 0., 0., 0., 0., 0.],
#        [1., 1., 0., 0., 0., 0., 0.],
#        [1., 1., 1., 0., 0., 0., 0.],
#        [1., 1., 1., 1., 0., 0., 0.],
#        [1., 1., 1., 1., 1., 0., 0.],
#        [1., 1., 1., 1., 1., 1., 0.],
#        [1., 1., 1., 1., 1., 1., 1.]])

values = np.array([1, 2, 3, 4, 5, 6, 7]).reshape((window_size, 1))
# array([[1],
#        [2],
#        [3],
#        [4],
#        [5],
#        [6],
#        [7]])

# row1 output: 1*1 + 0*2 + 0*3 .... + 0*7 = 1
# row2 output: 1*1 + 1*2 + 0*3 .... + 0*7 = 3
# row2 output: 1*1 + 1*2 + 1*3 .... + 0*7 = 6
# ...
# row7 output: 1*1 + 1*2 + 1*3 .... + 1*7 = 28
{% endhighlight %} 

The output numbers on each row are the cummulative sum of the input numbers. Given the definition on 
what is an average:

$$\bar{x} = \frac{1}{n} \sum{x_i} = \frac{1}{7} (x_1 + x_2 + \ldots + x_7)$$

We can simply divide each row with its corresponding count up to that point, which is 
a simple arangment from `1, 2, ..., 7`. So the `window` variabe behaves like a kernel, and we 
can use different kernels to get different properties out. Lets say you want to compute 
the moving average for even and odds. 

Using this method we just do:

{% highlight python linenos %}
import numpy as np

window_size = 7
odds = (np.vstack([np.ones(window_size) if i%2==0 else np.zeros(window_size) for i in range(7)])
evens = 1 - odds # invert ones with zeros and vice-versa 
odds_kernel = np.tril(odds)
evens_kernel = np.tril(evens)

# evens_kernel:
# array([[0., 0., 0., 0., 0., 0., 0.],
#        [1., 1., 0., 0., 0., 0., 0.],
#        [0., 0., 0., 0., 0., 0., 0.],
#        [1., 1., 1., 1., 0., 0., 0.],
#        [0., 0., 0., 0., 0., 0., 0.],
#        [1., 1., 1., 1., 1., 1., 0.],
#        [0., 0., 0., 0., 0., 0., 0.]])

values = np.array([1, 2, 3, 4, 5, 6, 7]).reshape((window_size, 1))
# array([[1],
#        [2],
#        [3],
#        [4],
#        [5],
#        [6],
#        [7]])

moving_average_odds = ((odds_kernel @ values) / counts).reshape(-1)
# output: array([1., 0., 2., 0., 3., 0., 4.])

moving_average_evens = ((evens_kernel @ values) / counts).reshape(-1)
# output: array([0. , 1.5, 0. , 2.5, 0. , 3.5, 0. ])
{% endhighlight %} 

You can make your own kernels and even throw some `np.random.dirichlet` for a weighted moving average.
And thats it, a simple way to compute a moving average using linear algebra.