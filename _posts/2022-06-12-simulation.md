---
layout: post
title:  Simulation!
date:   2022-06-12
categories: statistics sim
---

In this post we will look at the basic idea behind simulating the world around us. For this purpose I have build a toy problem 
we need to try to comprehend and solve. 

#### Problem statement
> A city is in need to understand better their emergency responses services and if they are below a given threshold. The proportion
of emergency vehicles is below this threshold? What can we do to make it better?

The statement is a bit general, no data is provided. How do we go about trying to understand this problem?

#### Simulation
_[Simulation](https://en.wikipedia.org/wiki/Simulation){:target="_blank"} is the imitation of real-worlds processes over time._ It is
fairly easy to define, and fun to work with. There is one rule in Simulation, **always state your assumptions**. If you are not doing that
someone else is doing it for you. Other than that, the accuracy of your simulator to imitate real-life, depends on how these assumptions 
hold in the real-world. 

As an example, if we are trying to model heights of a population, it is easy to use the 
[Normal Distribution](https://en.wikipedia.org/wiki/Normal_distribution){:target="_blank"}. This is because height is a continuous measure,
people do not generally deviate too much from it; that is to say you will see very few people that deviate $$5\sigma$$ from the mean $$\mu$$.
The motivation of the Normal Distribution is that most of the density is based within the mean ([68-95-99 rule](https://en.wikipedia.org/wiki/68%E2%80%9395%E2%80%9399.7_rule){:target="_blank"}).


However, if we would use another distribution like [Binomial](https://en.wikipedia.org/wiki/Binomial_distribution){:target="_blank"} for the height, 
it would be the same as in high school physics where we approximated cows as sphere (or cubes). It would work, but it would be a bit clunky.

_Tangent: if you want to learn why it would have worked, i suggest you read on the [Central limit theorem](https://en.wikipedia.org/wiki/Central_limit_theorem){:target="_blank"}._


_work in progress..._
