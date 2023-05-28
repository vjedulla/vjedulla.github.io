---
layout: post
title: Blending guesses
subtitle: estimating a celebrity's age.
date: 2023-05-11
tags: [statistics]
readtime: True
last-updated: 2023-05-28
---


Celebrities tend to age differently from *normal* humans (e.g. Keanu Reeves) 
and whenever I'm talking with my girlfriend we sometimes get into a discussion on how old is a celebrity.
So logically we often play the game: __"Guess that celebrity age"__. She is far better guesser than me. Putting concrete numbers, 
we can say that we both make estimations errors normally distributed (hehe. NO! but its a game), and my error standard deviation is 7.3 years, and her's is 3.3 years. The main question becomes *"can we combine these guesses to arrive at a better guess together?"*. The answer is yes, and we just need some algebra and calculus (as with everything in life).


## Formal representation
To generalize this problem say that two people come up with two guesses, $$A$$ and $$B$$ and $$\sigma_1^2$$ and $$\sigma_2^2$$ variances
respectively. To generate a better guess $$Y$$ we can combine it using a $$p$$ probability of blending first guess, and $$(1-p)$$ of 
blending the second as such:

$$Y = p * A + (1-p) * B$$


Say that our guesses are independent, we can express the variance as such:

$$Var(Y) = Var(A) + Var(B)$$

expanding it to:

$$Var(Y) = p^2 * \sigma_1^2 + (1-p)^2 * \sigma_2^2$$

*Notice: linearity of variance tells us to give square factor to the "multiplier" whenever we are summing up variances.*

If we calculate the derivative of the variance with respect to $$p$$ we get:

$$Var(Y)^` = 2p * \sigma_1^2 - 2(1-p) * \sigma_2^2 = 0$$

If we calculate the second derivative of variance with respect to $$p$$ we see its $$2 (\sigma_1^2 + \sigma_2^2)$$ which is always
positive, meaning we can find the minimum $$p$$ by solving the equation above.

and rearranging for $$p$$:

$$2p * \sigma_1^2 - (2 - 2p) * \sigma_2^2 = 0$$

$$2p\sigma_1^2 - 2\sigma_2^2 + 2p\sigma_2^2 = 0$$

$$2p\sigma_1^2 + 2p\sigma_2^2 = 2\sigma_2^2$$

$$p(\sigma_1^2 + \sigma_2^2) = \sigma_2^2$$

$$p = \frac{\sigma_2^2}{\sigma_1^2 + \sigma_2^2}$$

And our original formula becomes:

$$Y = (\frac{\sigma_2^2}{\sigma_1^2 + \sigma_2^2}) * A + (1 - \frac{\sigma_2^2}{\sigma_1^2 + \sigma_2^2}) * B$$

Using this formula we can create a better guess given two guesses and their variances. 

## Example
Let's take the example of my girlfriend and me again, and we are trying to guess the age of Keanu Reeves.

$$A = 50$$ with $$\sigma_1^2 = 7.3$$ years

$$B = 60$$ with $$\sigma_1^2 = 3.3$$ years

$$Y = (\frac{3.3^2}{3.3^2 + 7.3^2}) * 50 + (1 - \frac{3.3^2}{3.3^2 + 7.3^2}) * 60$$

<!-- $$Y = (\frac{10.89}{64.18}) * 50 + (1 - \frac{10.89}{64.18}) * 60$$ -->

$$Y = (0.169) * 50 + (1 - 0.169) * 60$$

<!-- $$Y = 8.45 + 49.86$$ -->

$$Y = 58.31$$

According to wikipedia, [Keanu Reeves](https://en.wikipedia.org/wiki/Keanu_Reeves) is 58 years old exactly.