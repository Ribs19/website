---
title: "Classic Singleton Pattern"
summary: "This document explains the Singleton pattern, highlighting its implementation and benefits using the Metalama framework."
keywords: "Singleton pattern, Metalama framework, Singleton attribute, static Instance property, code consistency, boilerplate reduction"
---

{: .intro }
The Singleton pattern is arguably one of the most famous creational design patterns. It focuses on ensuring that a class has only one instance and provides a global point of access to that instance.

## Example

The following `PerformanceCounterManager` class is a classic Singleton example, designed to consistently gather performance counters across an entire application. The `[Singleton]` class attribute indicates it's a Singleton and is also an aspect that can be [developed using Metalama](https://doc.metalama.net/examples/singleton/singleton-1#aspect-implementation). It generates a static `Instance` property and reports an error if there is a public constructor. If needed, it also creates a private constructor.

```cs
// [<focus>]
[Singleton]
// [<endfocus>]
public class PerformanceCounterManager
{
    private readonly ConcurrentDictionary<string, int> _counters = new();

    public void IncrementCounter(string name)
        => this._counters.AddOrUpdate(name, 1, (_, value) => value + 1);
}
```

The `[Singleton]` aspect generates the following code:

```cs
public class PerformanceCounterManager
{
    // [<added>]
    public static PerformanceCounterManager Instance { get; } = new();
    private PerformanceCounterManager() {}
    // [<endadded>]

    private readonly ConcurrentDictionary<string, int> _counters = new();

    public void IncrementCounter(string name)
        => this._counters.AddOrUpdate(name, 1, (_, value) => value + 1);
}
```

## Metalama benefits

* **Better expressiveness**. The `[Singleton]` attribute makes the intent of the class clear and explicit. It's easier to understand the code and maintain it.
* **Code consistency**. The generated code is always consistent with the pattern rules. Although the Singleton pattern has very little repetitive code, it is easy to forget to make the constructor private or to call the Instance method in the same way.
* **Less code**. You're just saving two lines of code thanks to this aspect, so boilerplate reduction will not be your main motivation.

## Resources

* Example: [Classic Singleton](https://doc.metalama.net/examples/singleton/singleton-1)
