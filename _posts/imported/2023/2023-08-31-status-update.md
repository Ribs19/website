---
layout: post 
comments: false
title: "Metalama Status Update, July-August 2023"
date: 2023-08-31 08:00:01 +01:00
categories: [Status Update]
permalink: /blog/metalama-status-update-2023-08
origin: https://blog.postsharp.net/metalama-status-update-2023-08
author: "Gael Fraiteur"
image: /assets/images/2023/2023-08-31-status-update/llama.png
summary: "The blog post provides an update on Metalama's developments from July-August 2023, including the release of Metalama 2023.2, the upcoming launch of Metalama 2023.3, the open-sourcing of Code Contracts and Caching libraries, enhancements to T#, and new video tutorials."
---

Though July and August are usually slower months for us, this year we're excited to bring you some major updates. We've open-sourced two key libraries for Metalama—Code Contracts and Caching—which together comprise 47,000 lines of code. Our template language, T#, has also been enhanced, allowing templates to call other templates. We've simplified the use of Roslyn from your aspects and have launched nine video tutorials to help you get started.

## Metalama 2023.2 General Availability

On August 7th, Metalama 2023.2 was officially released, featuring 32 bug fixes and 5 minor improvements, but no new features. For more details, check the [official announcement](https://metalama.net/blog/metalama-2023-2-ga).

## Metalama 2023.3 Code-Complete Preview

We're thrilled to announce that Metalama 2023.3 is now code-complete, bringing significant new features along with 18 minor improvements and 44 bug fixes.

All packages have been uploaded to `nuget.org` and we recommend you also [download](https://1drv.ms/u/s!AjIdLvQsWyhnhopmn6uFKjxVfG9gVA?e=unIA2S) and install the new Visual Studio extension

### Code Contracts

Our Code Contracts library is an [open-source](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Contracts), aspect-oriented implementation of [System.ComponentModel.DataAnnotations](https://learn.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations). Unlike Microsoft's annotations, Metalama's Code Contracts works with any C# code, not just ASP.NET MVC or Entity Framework, as it utilizes aspects to inject validation logic during compilation.

You can use a range of contracts like [Required](https://doc.metalama.net/api/metalama_patterns_contracts_requiredattribute), [EmailAddress](https://doc.metalama.net/api/metalama_patterns_contracts_emailaddressattribute), [StrictlyLessThan](https://doc.metalama.net/api/metalama_patterns_contracts_strictlylessthanattribute), and [many more](https://doc.metalama.net/api/metalama_patterns_contracts).

If you're already using PostSharp code contracts, migration is straightforward with minimal code alterations, as we only changed the way exception messages and types are customized.

In Metalama, customizing the type and text of exceptions thrown is as simple as overriding the [ContractTemplates](https://github.com/metalama/Metalama.Patterns/blob/HEAD/src/Metalama.Patterns.Contracts/ContractTemplates.cs) class and setting your implementation to `LoggingOptions.Templates`.

For those who often have to verify public APIs for non-null arguments, we've simplified the process to one line of code per _project_:

```cs
 amender.Outbound.VerifyNotNullableDeclarations();
```

This is a feature we're particularly proud of!

### Caching

We've also ported our PostSharp-based caching framework to Metalama and completely [open-sourced](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Caching) it. We updated the codebase to take full advantage of modern .NET and C#, including the use of `IReadOnlySpan<char>` to further reduce garbage collection load.

If you're unfamiliar with [PostSharp Caching](https://doc.postsharp.net/caching), it offers a robust set of features:

* Method results caching based on parameters with the `[Cache]` attribute.

    ```cs
    partial class CustomerService
    {
        [Cache]
        Customer GetCustomer( string customerId )
        {
            // Database logic.
        }
    }
    ```

* Direct cache invalidation using the `[InvalidateCache]` attribute.

    ```cs
    partial class CustomerService
    {
        [InvalidateCache(nameof(GetCustomer))]
        Customer UpdateCustomer( string customerId, string name )
        {
            // Database logic.
        }
    }
    ```
  
* Programmatic direct cache invalidation:

    ```cs
    partial class CustomerService
    {
        Customer UpdateCustomer( Customer customer )
        {
            _cachingService.Invalidate( GetCustomer, customer.Id );
            
            // Database logic.
        }
    }
    ```
  
* Indirect cache invalidation through dependencies:

    ```cs
    partial class CustomerService
    {
        [Cache]
        Customer GetCustomer( string customerId )
        {
            CachingServices.CurrentContext.AddDependency( new MyDependency( nameof(Customer), customerId ) );

            // Database logic.
        }
        
        Customer UpdateCustomer( Customer customer )
        {
            _cachingService.Invalidate( new MyDependency( nameof(Customer), customerId ) );

            // Database logic.
        }
    }
    ```
  
* Full customization of the cache key generation mechanism.

* Support for various caching topologies, including local in-memory, Redis-based network caching, two-layer caches, and distributed caching via Azure Service Bus.

Transitioning from PostSharp to Metalama should be relatively smooth; most of the unit tests, honed over a decade, have been retained. However, you may first need to disable the dependency injection feature:

```cs
[assembly: CachingConfiguration( UseDependencyInjection = false )]
```

### T# Templates Now Support Nested Calls

We've lifted a notable constraint from earlier versions of T#: templates now have the capability to invoke other template methods. 

A "template method" is defined as any method adorned with the `[Template]` custom attribute. Although these methods can be static, the enclosing class must implement the empty interface, `ITemplateProvider`.

There are two approaches to invoking one template from another:

* **Statically**: Simply call the template method in the usual C# manner. Note that these methods can also be virtual.

    ```cs
    public override dynamic? OverrideMethod()
    {
        LogStart();
    
        // Additional logic.
    }
    
    public override async Task<dynamic?> OverrideAsyncMethod()
    {
        LogStart();
    
        // Additional logic.
    }
    
    [Template]
    protected virtual void LogStart() 
    {
        this._logger.Log($"Method {meta.Target.Method.Name} is starting.");
    }
    ```
    
* **Dynamically**: Utilize `meta.InvokeTemplate`, supplying both the parameters and type parameters. This method is particularly useful when working with strongly-typed templates that use generic method parameters, and you wish to bind the generic parameter to an `IType`.

The current limitation is that templates can only be invoked as a _statement_, not as an expression. In other words, you can't capture a return value from the invoked template.

We're working on expanding our documentation to cover this new feature, which is extensively utilized in our code contracts library. For a hands-on example, you can start by examining [RegularExpressionBaseAttribute.cs](https://github.com/metalama/Metalama.Patterns/blob/HEAD/src/Metalama.Patterns.Contracts/RegularExpressionBaseAttribute.cs).

### Enhanced Capabilities with Metalama.Framework.Sdk

You can now seamlessly use the Roslyn API for low-level code model analysis using the `Metalama.Framework.Sdk` package. Although this package was available before, it wasn't directly accessible from an aspect project. That limitation has been removed.

When adding this package to your project, it's important to set all assets to private. This ensures that neither the package nor its dependencies, including Roslyn, get propagated to the consumers of your project or packages.

```xml
<ItemGroup>
    <PackageReference Include="Metalama.Framework.Sdk" PrivateAssets="all"/>
</ItemGroup>
```

For those interested in leveraging this feature, consult the [conceptual documentation](https://doc.metalama.net/conceptual/sdk). You may also find the following examples illuminating:

* [INotifyPropertyChanged Dependency Graph](https://github.com/metalama/Metalama.Samples/tree/HEAD/examples/sdk): These examples demonstrate how to analyze the dependency graph of properties. For instance, they show how to detect when a change in the `FirstName` property necessitates updating the `FullName` property.

* [Metalama.Extensions.Metrics](https://github.com/metalama/Metalama.Extensions/tree/develop/2023.3/src/Metalama.Extensions.Metrics): This example reveals how to define metrics, a powerful but currently underutilized feature, aimed at tasks like measuring lines of code (LOCs) or gauging complexity. However, it's worth noting that this is not yet usable from LinqPad.

* [Metalama.Community](https://github.com/metalama/Metalama.Community/tree/develop/2023.3): This repository showcases how to craft aspects that perform arbitrary code transformations using the Roslyn API. Examples include making all methods virtual, automating the flow of `CancellationToken`, or embedding referenced assemblies as managed resources. Many of the aspects presented here are adaptations from Fody.


### Debugging and troubleshooting

* In the error list, with most errors and warnings reported by aspects, you can now see which aspect class and target declaration reported the diagnostic.
* It is now possible to enable performance profiling of Metalama processes. See [this documentation page](https://doc.metalama.net/conceptual/configuration/profiling) for details.
* Metalama Tools for Visual Studio has improved reporting of errors in compile-time code.
* The debugging experience of templates and compile-time code has been dramatically improved. However, it is still required to use `Debugger.Break()` or `meta.DebugBreak()` to add an initial breakpoint.

### Object model


* A new property, `IDeclaration.Sources`, exposes references to the source code. You can now get any declaration's file path, line, and column.
* New overload `IMethod.Invoke( IEnumerable<IExpression> )` to generate dynamic method calls.
* Invoking a method from the target type with `InvokerOptions.Base` and an instance (other than `base`) is now possible if the base layer is in the current type.
* Any aspect can now reflect on any other aspect instance (`IAspectInstance`) added before the current aspect thanks to the new API `declaration.Enhancements().GetAspectInstances()` returning an `IEnumerable<IAspectInstance>`. The previous method, `GetAspect<T>`, did not return the `IAspectInstance` and gave no access to the `IAspectState`.
* `Metalama.Extensions.DependencyInjection`: You can now introduce a dependency programmatically.
* `RunTimeAspectHelpers` has been improved.
* New `[RunTime]` attribute that restricts to run-time the scope of a type that derives from a `[RunTimeOrCompileTime]` base class or interface.
* `IAdviceFactory`: introduction methods now return the existing member for OverrideStrategy.Ignore.
* `AsyncEnumerableList<T>.Enumerator` now has a `Parent` property which gets the `AsyncEmumerableList<T>` over which the enumerator enumerates. This allows methods such as `BufferToListAsync<T>` (see below) to avoid creating a new `AsyncEmumerableList<T>` when an enumerator is already based on an `AsyncEmumerableList<T>`.
* `RunTimeAspectHelper` has new members new method `BufferToListAsync<T>( this IAsyncEnumerator<T> ...)` which buffers an async enumerator into an `AsyncEmumerableList<T>`, and returns the list. This supports scenarios such as caching.

### Performance

* The design-time performance of reference validators has been improved.
* Performance improvement of `Metalama.Framework.Workspaces`, especially useful while using the Metalama driver for LinqPad.

### Other

* We merged Roslyn 4.7.
* Overriding asynchronous methods with a template has been improved.


## Video Tutorials

This summer, I've had the pleasure of creating [9 video tutorials](https://doc.metalama.net/videos) to walk you through Metalama's most crucial features.

## What's On the Horizon

Autumn typically marks the period when Microsoft completes its new version of .NET. As is our annual practice, we will wait for Microsoft to release the first Release Candidate and will ensure that both PostSharp and Metalama are fully compatible with the updated stack. Our aim is to release a PostSharp and Metalama Release Candidate one to two weeks after Microsoft announces the General Availability (GA) of .NET and Visual Studio.

Concurrently, we're working on a fresh Metalama-based implementation of `INotifyPropertyChanged`. Unlike our previous efforts with caching and code contracts, we will not start from the PostSharp-based implementation. We plan to port only the unit tests from PostSharp, without striving to mirror its behavior exactly. Following this, our next goal will be to introduce dependency properties and integrate them with both code contracts and `INotifyPropertyChanged`. All of these developments will be released as open source.

If time permits, we'll also aim to address some of the easier-to-implement features [requested by the community](https://github.com/metalama/Metalama/labels/enhancement).

## In Conclusion

To sum up, it's been an action-packed few months for us. We've rolled out a bug-fix update in Metalama 2023.2 and are on the cusp of launching Metalama 2023.3, which will introduce robust new features such as Code Contracts and Caching — both of which are now open-source — as well as noteworthy enhancements to T#. Stay tuned for forthcoming documentation, and do check out the new video tutorials to get up to speed efficiently.

Wishing you productive meta-programming adventures with Metalama!

-gael
