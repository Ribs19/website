---
title: "Object Services"
summary: "Learn how to use Metalama to generate common object-oriented services like deep cloning or ToString."
keywords:
- c# clone
- c# tostring
---

{: .intro }
Metalama can generate code for the common services you often need to add in class hierarchies to override their system implementations. While not as fancy as design patterns, they still contribute significantly to boilerplate code and potential defects.

| Service | How Metalama can help |
|---------|-----------------------|
| [Cloning](cloning) | Automatically implements `ICloneable`, eliminating repetitive code and reducing errors. |
| [ToString](tostring) | Generates the `ToString` method based on the type properties, with opt-in or opt-out strategies. |
| [Equatable](equatable) | Implements the equality comparison pattern, allowing you to select the members that are part of the contract. |
