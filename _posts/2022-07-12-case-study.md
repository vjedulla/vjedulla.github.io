---
layout: post
title: Convolution [case study]
subtitle: Why is this concept so convoluted?
date:   2022-07-22
tags: [case-study, math]
---

Convolution is a mathematical operation usually depicted with the asterisk symbol $$f \ast g$$. One problem that
this operation usually has a convoluted explanation which makes it difficult to conceptualize what is is useful for. 
In this post I will try to give a simple explanation of this operator, then give a use case when this operator is 
useful to be used at. 


### Intuitive explanation
Being in the data science field, we all heard and used window functions like moving average. Convolution can be thought of 
as moving window multiplication between two functions. This does not sound any better than the formal definition:

$$(f \ast g)(x) = \int_{-\infty}^{\infty} f(\tau)g(x-\tau) d\tau$$

This looks strange, however, combining the idea of moving multiplication and this "simple" equation, we can guess what happens.
$$\tau$$ here is a new dummy variable for x. Think of it as a offset (lingering back to the moving multiplication idea, something 
has to be moving). 