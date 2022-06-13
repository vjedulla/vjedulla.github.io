---
layout: post
title:  Simulate!
date:   2022-06-12
categories: statistics sim
---

In this post we will look at the basic idea behind simulating the world around us. For this purpose we will use a toy problem that happens
mostly in logistics planning. 

#### Problem statement
> Officials of a city are in need to understand better their emergency responses services and if they are below a given threshold (in minutes). 
> How is the distribution of response times in the city? Is there a bottleneck we can resolve?

The statement is a bit vague and no data is provided. How do we go about trying to understand this problem, let alone solve it?  

#### Simulation
_[Simulation](https://en.wikipedia.org/wiki/Simulation){:target="_blank"} is the imitation of real-worlds processes over time._ It is
fairly easy to define, and fun to work with. There is one rule in simulation, **always state your assumptions**. If you are not doing that
someone else is doing it for you. Other than that, the accuracy of your simulator to imitate real-life, depends on how these assumptions 
hold in the real-world. 

As an example, if we are trying to model heights of a population, it is easy to use the 
[Normal Distribution](https://en.wikipedia.org/wiki/Normal_distribution){:target="_blank"}. This is because height is a continuous measure,
people do not generally deviate too much from it; that is to say you will see very few people that deviate $$5\sigma$$ from the mean $$\mu$$.
The motivation of the Normal Distribution is that most of the density is based within the mean ([68-95-99 rule](https://en.wikipedia.org/wiki/68%E2%80%9395%E2%80%9399.7_rule){:target="_blank"}).


However, if we would use another distribution like [Binomial](https://en.wikipedia.org/wiki/Binomial_distribution){:target="_blank"} for the height, 
it would be the same as in high school physics where we approximated cows as sphere (or cubes). It would work, but it would be a bit clunky.

_Tangent: if you want to learn why it would have worked, i suggest you read on the [Central limit theorem](https://en.wikipedia.org/wiki/Central_limit_theorem){:target="_blank"}._


##### Step 1: Generate a sample dataset
We need to generate data. But what data specifically? First of we need a way to generate $$n$$ points on a 2D grid. 

{% highlight python %}
def random_coords(n=5, bounds=(50.770, 50.859, 4.248, 4.496)):
    """
        Generates random uniform points on a plane 
    """
    # Brussels bounds
    # 50.770883, 4.361551 - south
    # 50.928138, 4.363065 - north
    # 50.863287, 4.248941 - east
    # 50.859386, 4.496820 - west
    x = np.random.uniform(bounds[0], bounds[1], n)
    y = np.random.uniform(bounds[2], bounds[3], n)

    for i in range(n):
        yield x[i], y[i]

def gen_correlated_points(x_prime, y_prime, n=2):
    """
        Given a coordinate (x', y') generate 2D points around it
        with a random covariance.
    """
    A = np.random.uniform(0.05, 0.15, (2, 2))
    cov = np.dot(A, A.transpose())
    
    cov = cov*np.random.uniform(-0.2, 0.2)

    p1 = np.random.multivariate_normal([x_prime, y_prime], cov, size=n)
    
    # how many people need to be transported/assisted
    pos = np.random.poisson(lam=1, size=(n, 1.3))
    pos[pos == 0] = 1  # at least 1
    np.random.shuffle(pos)
    data = np.hstack((p1, pos))
    
    return data

{% endhighlight %}


There are 3 functions here that will help us achieve our goal. 

1. `random_cords` -> takes in $$n$$ and a bounding region (for a city, but its not necessary it just looks good on a map)
2. `gen_correlated_points` -> takes in a point $$(x_{prime}, y_{prime})$$ and generates a correlated blob of points with a random covariance matrix.
3. `gen_points` -> same as above, but with a given covariance matrix.


Tha base idea here is that we need a way to generate random points on a grid, then a way to generate a set of correlated points. 
What this mimics is the ability of bad neighborhoods or roads where a lot of emergency services are needed.

![Generated Map](/assets/acc_sim/map_generate.png)

Or looking it through a bit more abstractly, a heatmap and a scatter-plot tells us the proximity of these points.

![Generated diagram](/assets/acc_sim/map_points.png)

##### Step 2: Repeat multiple times?
We cannot create one dataset, analyze it and hope that the public will trust our analysis. We need to generate a lot of these
datasets and perform analysis on top of them, so to say that we ensure the public of our work. We can go about and generate using 
the same algorithm we devised in the first section. However, this would mean a lot of parameter tunning, and generally annoying to 
parametrize correctly. We will go about and replicate the gist of our dataset using GMM ([Gaussian Mixture Models](https://scikit-learn.org/stable/modules/mixture.html#:~:text=A%20Gaussian%20mixture%20model%20is,Gaussian%20distributions%20with%20unknown%20parameters.){:target="_blank"}).
`scikit-learn` has an implementation of GMM and it is simple to use. 


{% highlight python %}
from sklearn.mixture import GaussianMixture as GMM

gmm_models = []

for n in range(1, 20, 2):
    gmm = GMM(n_components=n, covariance_type='full', n_init=20, warm_start=True)
    gmm_fitted = gmm.fit(data)
    labels = gmm_fitted.predict(data)
    gmm_models.append((gmm_fitted, labels, gmm_fitted.bic(data)))
{% endhighlight %}

_Note: We generate a lot of these mixture models to try and understand how many "clusters" of points are there, and use BIC score to take the best one._

Another interesting thing about GMM is that they are just mixed gaussian distributions that we can generate as many points as we want, we are not bound by the 
parameters to generate a sample of data. 

![Generated GMM](/assets/acc_sim/generated_gmm.png)

This works well for small number of points (which is our goal), however we can see the gaussians clusters when we increase the number of sampling points.

##### Step 3: Analysis
Now we have come to the interesting part of this post. First we need a couple of emergency care centers like hospitals, but this analysis is 
similar for other emergency vehicles like police or fire department. We can use the functions from step one to create some uniform points on the map
that represent the hospitals. 

The number of hospitals in a city is relatively small (5-10) in medium cities, and each hospital has their fleet of 
emergency vehicles. The latter is needed due to the logic we will implement will include the availability of a their vehicles
to respond to an emergency. _Note: these are assumptions that are needed to drive forward the simulation._


The logic of our simulation is fairly easy, we have $$m$$ hospitals and $$n$$ accidents we need to attend to. Each hospital $$m_i$$ has 
$$x$$ vehicles at their disposal. Given an accident event $$e$$ we will assign the first responder based on two criteria:
1. Closest hospital
2. Has the availability at that point in time (otherwise add a $$\epsilon \sim N(20, 5)$$ to the delay)


{% highlight python %}
def logic(xy_acc, amb_val, availability):
    distances, indices = nbrs.kneighbors(xy_acc)
    distances *= 50 # since cords are gps points, just a trick to get "human" distances
    
    avg_speed_amb = np.random.normal(60, 5, size=len(centers))
    epsilon = np.random.normal(20, 5, size=len(xy_acc))
    
    tta_s = []
    for i in range(len(xy_acc)):
        not_found = True
        for j in range(len(centers)):
            if availability[ indices[i][j] ] >= amb_val[i]:
                tta = (distances[i][j] / avg_speed_amb[j])*60
                tta_s.append(tta)
                
                # assign
                availability[indices[i][j]] -= amb_val[i]
                not_found = False
                break
                
        if not_found:
            tta_s.append(epsilon[i])
    
    return np.array(tta_s)
{% endhighlight %}

The code above has a lot of assumptions that do not reflect the real-world, but sometimes we just need some spherical cows to make our job
a bit easier. 

![Resulting time to serve](/assets/acc_sim/resulting_tts.png)

The resulting diagram is the response time given 200 iteration with the logic we described. We can see that most of the density of this KDE
is clustered near 7 minute to 17 minute response. However, we see a spike at 23 minute response time, this is the effect of $$\epsilon$$ 
that we drew whenever all hospitals had their vehicles associated with other events. This is the worst case part. One way to control this 
from not happening is have more emergency vehicles at your disposal. However, by how much and when is a post for another day and another time.

#### Conclusions 
In this post we have seen how to generate data given a toy problem. The data we generated does not mimic the real world by no means, however, this is good enough 
for us to dive into some kind of analysis. As we saw in our case, the goal was to get an average time to serve each event, given our assumptions. 
In the real-world you would __not__ need to create data, as the the data is already given. 