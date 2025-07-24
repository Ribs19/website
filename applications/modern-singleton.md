---
title: "Modern Singleton Pattern"
summary: "The modern Singleton pattern uses Dependency Injection to manage instances, improving testability. Use Metalama to enforce architectural constraints."
keywords: "Singleton pattern, Dependency Injection, testability, Metalama, architectural constraints, IServiceCollection.AddSingleton, modern Singleton"
---

The classic Singleton pattern has not aged well. It's considered an anti-pattern because it is difficult to test and incompatible with the Dependency Injection paradigm.

A modern approach to the Singleton pattern is to use a Dependency Injection container to manage the lifecycle of the singleton instance (e.g., `IServiceCollection.AddSingleton`).

The main problem with the modern Singleton is that it is challenging to ensure the constructor is used only in the appropriate context, typically from the `Startup` code and unit tests. Metalama can help you [enforce architectural constraints](https://doc.metalama.net/conceptual/architecture) and report violations directly in the code editor as warnings.

## Example

The following `PerformanceCounterManager` class is a modern Singleton example. It has a public constructor but is registered as a Singleton in the DI container.

```cs
// [<focus>]
[Singleton]
// [<endfocus>]
public class PerformanceCounterManager : IPerformanceCounterManager
{
    private readonly ConcurrentDictionary<string, int> _counters = new();
    private readonly IPerformanceCounterUploader _uploader;

    public PerformanceCounterManager( IPerformanceCounterUploader uploader )
    {
        this._uploader = uploader;
    }

    public void IncrementCounter( string name )
        => this._counters.AddOrUpdate( name, 1, ( _, value ) => value + 1 );
}
```

The `[Singleton]` aspect reports warnings when any class other than `Startup` or a unit test attempts to call the constructor.

```cs
class MetricsCollection( IPerformanceCounterUploader uploader )
{
    // [<warning>]
    // WARNING: The class is a [Singleton]. Do not create new instances, instead use PerformanceCounterManager.Instance.
    // [<endwarning>]
    PerformanceCounterManager _performanceManager = new( uploader );
}
```

{: .show-more }
Show me how it works!

Here is the code of the `[Singleton]` aspect:

```cs
public class SingletonAttribute : TypeAspect
{
    public override void BuildAspect( IAspectBuilder<INamedType> builder )
    {
        builder.Outbound
            .SelectMany( t => t.Constructors )
            .CanOnlyBeUsedFrom(
                scope => scope.Type( typeof(Startup) ).Or().Namespace( "**.Tests.**" ),
                description: "The class is a [Singleton]." );
    }
}
```

## Metalama benefits

* **Reduce human errors**. You can be confident that no improper code is calling the constructor directly instead of getting an instance from the DI container.

## Resources

* Blog post: [The Singleton Pattern in C# Today Is Not Your Dad's One!](https://metalama.net/blog/singleton)
* Example: [Validating the modern Singleton](https://doc.metalama.net/examples/singleton/singleton-2)
