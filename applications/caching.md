---
title: "Caching"
summary: "Metalama Caching is an aspect library for caching in C# and .NET, including invalidation. It minimizes repetitive code and errors."
keywords:
- c# caching
- .net caching
---

{: .intro }
Caching is probably the simplest way to boost the performance of an application. Maintaining a cache can be cumbersome, especially if you must add caching to dozens of methods and manage dependencies. Metalama makes this process simpler and more robust.

Traditionally, setting up caching involves working directly with the caching framework's API. You need to create cache keys, check if items are already in the cache, and add new items when necessary. Additionally, when the original data changes, you must ensure the cache is updated accordingly. It is one of the most error-prone tasks in software development.

With [Metalama Caching](https://www.nuget.org/packages/Metalama.Patterns.Caching), an open-source caching library based on Metalama, adding caching to a method can be as simple as adding a custom attribute.

{: .note }
`Metalama.Patterns.Caching` is a production-ready, professionally supported, and open-source aspect library. <i class="supported no-tooltip"></i>


## Example

Here is how caching can look using Metalama:

```cs
internal partial class CustomerServices
{
    // [<focus>]
    [Cache]
    // [<endfocus>]
    public Customer GetCustomer(int id)
    {
        Console.WriteLine($">> Retrieving the customer {id} from database...");
        Thread.Sleep(1000);
        return new Customer { Id = id, Name = "Rubber Debugging Duck" };
    }

    // [<focus>]
    [InvalidateCache(nameof(GetCustomer))]
    // [<endfocus>]
    public void UpdateCustomer(int id, string newName)
    {
        Console.WriteLine($">> Updating the customer {id} in database...");
        Thread.Sleep(1000);
    }
}
```

To initialize Metalama Cache, add this line to your startup code:

```csharp
// Add the caching service.
builder.Services.AddMetalamaCaching();
```

## Benefits

* **Reduced boilerplate**: Metalama Caching enables you to cache the return value of a method as a function of its arguments with just a `[Cache]` custom attribute. To invalidate the cache, add the `[InvalidateCache]` aspect to the update methods. To use a custom class as a parameter of a cached method, apply the `[CacheKey]` aspect to mark the properties that uniquely identify the object. Consequently, your business code becomes shorter and more readable.

* **Reduced bugs**: Manually generating cache keys with hand-written code is notoriously bug-prone. Metalama Caching eliminates this source of defects by implementing a reliable approach to key generation, combining object-oriented and aspect-oriented techniques.

* **Reduced coupling**: Cache invalidation can be complex and often requires you to review your complete write methods every time you add caching to a read method. Cache dependencies act as an abstraction layer between read and write methods, reducing coupling between them.

## Features

* `[Cache]` aspect for caching.
* `[InvalidateCache]` aspect for cache invalidation.
* `[CacheKey]` aspect to generate cache keys from objects.
* Type-safe cache invalidation API.
* Full support for dependency injection.
* Support for dependencies.
* Support for Redis. <i class="premium"></i>
* Support for cache synchronization over a message bus. <i class="premium"></i>

## Resources

* Reference documentation: [Metalama.Patterns.Caching](https://doc.metalama.net/patterns/caching)
* NuGet package: [Metalama.Patterns.Caching](https://www.nuget.org/packages/Metalama.Patterns.Caching)
* Source code: [Metalama.Patterns.Caching](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Caching)
* Example: [Create your own caching aspect](https://doc.metalama.net/examples/caching)
* Blog post: [Five ways to add caching to your ASP.NET App](https://metalama.net/blog/aspnet-caching)
* Blog post: [Simplify your ASP.NET Aspire caching with Metalama](https://metalama.net/blog/aspire-caching-metalama)
