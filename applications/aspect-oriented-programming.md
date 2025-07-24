---
title: "Aspect-Oriented Programming in C#"
short_title: "Aspect-Oriented Programming"
keywords:
- aspect-oriented programming C#
- aspect-oriented programming .NET
- aop C#
- aop .net
summary: "Aspect-Oriented Programming (AOP) extends Object-Oriented Programming with a paradigm that focuses on separating the implementation of repetitive code patterns from the main business logic. This page presents the main characteristics of AOP as well as different implementations for C# and .NET."
---

{: .intro }
Aspect-Oriented Programming (AOP) extends Object-Oriented Programming with concepts and tools that focus on separating the implementation of repetitive code patterns from the main business logic.

Without AOP, repetitive code patterns are implemented manually in source code, resulting in additional (and tedious) work, excessive code complexity, and more defects.

Telemetry data shows that AOP can decrease the number of lines of code by 15%. Not only does it reduce development costs and defects, but it also makes the code cleaner and easier to read, greatly simplifying maintenance.

Aspect-oriented programming relies on three concepts:

* _Aspects_ are a mechanism to encapsulate patterns of repetitive code. Aspects know how to mechanically modify your source code to add new behaviors.

  Aspects are like custom attributes that alter the way your code executes, e.g., by adding caching, exception handling, or immutability. Aspects work like templates that you can apply to hand-written code. They must be applied to a declaration—typically a method, property, or class.

  Aspects are made of several primitive transformations named _advice_. For instance, overriding a method, adding an interface to a class, or intercepting field accesses are different kinds of advice.

  In addition to advising the code, good aspect frameworks enable you to analyze source code and report errors and warnings.

* Several targeting mechanisms to apply aspects to source code, including:

    * Custom attributes,
    * Code queries executed at compile time,
    * Inheritance from base types to derived types.

* A composition mechanism ensuring that several aspects (e.g., logging and caching) can be safely and predictably added to the same declaration.

The process of applying one or many aspects to source code is often called weaving.

## Is AOP still useful in C#?

AOP was formalized in the early 2000s as a way to improve the modularity of classic object-oriented languages at a time when Java and C# were still in their infancy. In the meantime, both languages and development practices have evolved. The generalization of the use of higher-order functions (delegates, anonymous methods, lambdas) and dependency injection has greatly improved modularity, covering some of the initial use cases of aspect-oriented programming. Therefore, some developers question the usefulness of AOP in modern applications.

The academic roots of aspect-oriented programming did not help. Esoteric jargon like _advice_, _pointcut_, and _joinpoint_ make AOP sound overly complex. Fortunately, .NET implementations, following PostSharp's lead, never followed this theoretical framework. After all, we don't even position Metalama as an aspect-oriented framework!

But despite the progress of programming languages and software engineering practices, despite the catastrophic communication around AspectJ, we still think that the gap identified by the early AOP researchers has not been completely addressed by classic languages.

I'm talking about the abstraction gap between human reasoning and programming languages.

Software architects think in terms of patterns and may say, "Add logging to all public methods of public classes in namespace `X`, and implement `INotifyPropertyChanged` for all classes derived from `BaseEntity`." However, the C# language does not have a way to do "for each declaration `X`, add behavior `Y`."

Therefore, to save developers from implementing these requirements by hand, languages like C# must be extended to support this kind of meta-programming feature.

Whether we call these meta-programming features AOP or just code generation is eventually just a secondary question.

## What are the typical uses of AOP in modern .NET?

In .NET, examples of code patterns that can be handled by AOP are:

* logging (AOP's "Hello, World" example), profiling,
* security,
* caching,
* transaction handling,
* observability (`INotifyPropertyChanged`),
* change tracking,
* design patterns such as Builder, Memento, or Factory,
* multi-threading,
* equality,
* `ToString`,
* WPF dependency properties and commands,
* storage (including object-database mapping and serialization),
* pulling dependencies.

## Example

Logging is the "hello, world" example of aspect-oriented programming. Here is a logging aspect implemented with Metalama:

```csharp
public class LogAttribute : OverrideMethodAspect
{
    Console.WriteLine( $"{meta.Target.Method}: starting.")

    try
    {
        return meta.Proceed();
    }
    finally
    {
        Console.WriteLine( $"{meta.Target.Method}: completed.")
    }
}
```

One way to add the aspect to a method is simply to add a custom attribute:

```csharp
[Log]
public void Greet()
{
  Console.WriteLine("Hello, world.");
}
```

If we want to target select targets using a code query instead of hand-picking one, we can use a fabric:

```csharp
internal class Fabric : ProjectFabric
{
  public override void AmendProject( IProjectAmender amender )
  {
      amender
        .SelectMany( c => c.Types )
        .SelectMany( t => t.Methods )
        .AddAspectIfEligible<LogAttribute>();
    }
}
```

Here is the _transformed_ code, i.e., the one that gets executed:

```csharp
public void Greet()
{
// [<added>]
  Console.WriteLine( $"{meta.Target.Method}: starting.")

  try
  {
// [<endadded>]
    Console.WriteLine("Hello, world.");
// [<added>]
  }
  finally
  {
    Console.WriteLine( $"{meta.Target.Method}: completed.")
  }
// [<endadded>]
}
```

## Benefits of aspect-oriented programming

### Benefit 1. Boosting development efficiency

Utilizing aspects in development significantly frees up time for more meaningful tasks. By employing Metalama, you can shift 10-50% of implementation workloads (depending on the project type) from your team to the compiler. This is possible because patterns typically rely on implementation guidelines, often involving algorithmic processes that machines excel at handling. Telemetry data shows that, depending on the type of project, companies typically save between 10% and 50% of source lines of code using Metalama. For instance, Clever Age, an IT consulting company, achieved a 24% code reduction when building an app for the French space agency.

With Metalama, you create an aspect once and save time while reducing source code each time the aspect is applied. Consequently, your codebase could shrink by 10-50% while maintaining the same functionality and enhanced reliability.

This approach allows developers to concentrate on inventive and value-adding tasks, increasing job satisfaction by eliminating the need to write repetitive low-level code. Metalama enables architects and senior developers to address overarching architectural challenges and streamline implementation, acting as talent multipliers within the team. New or junior team members can quickly ramp up and contribute more effectively, as they can focus on specific tasks without being burdened by low-level technical details.

### Benefit 2. Enhancing application reliability

Utilizing AOP enhances application reliability in several ways.

* First, less boilerplate code leads to fewer bugs. As best-selling author Steve McConnell points out, in a typical business application, one defect exists for every 40 lines of code. By reducing the source code, you not only decrease development costs but also the number of defects. Moreover, patterns implemented with aspects require testing only once, not every time they are applied to business code.

* Second, AOP allows you to code at a higher level of abstraction, with most low-level details reliably handled by the compiler. This results in simpler source code that is easier to reason about, thereby reducing the number of defects. AOP enables faster failure detection, often as soon as build time. Consider multithreading, for example. Instead of making field-level decisions with locks or events, you can make architectural decisions to apply the [Synchronized] threading model to the base class, with the aspect taking care of the rest. Thanks to PostSharp IL, ATS Global could write thread-safe, machine-verified code and avoid random bugs typically found in multithreaded applications.

* Lastly, AOP makes it affordable to prepare your app for production. You can add comprehensive logging to your entire codebase in minutes and implement features such as caching or exception handling without cluttering your business logic.

AOP is the ideal tool to enhance the robustness of your applications.

### Benefit 3. Taming code complexity

Utilizing aspects effectively reduces code complexity. By clearly separating technical details from business logic, code becomes cleaner, simpler, and easier to read. This clarity allows new team members to quickly understand the code, diagnose problems, fix bugs, and add new functionalities.

> “Sure, we achieved some considerable savings in terms of LOC. But more importantly, the new code is much less complex and much easier to maintain. This is what really saves time and money in the long run.”
> Daniel Wolf, Project Manager, mobileX AG

### Benefit 4. Streamlining maintenance

Ultimately, the primary advantage of using AOP is reducing maintenance costs and extending the codebase's lifespan before a complete rewrite becomes necessary. Considering that maintenance accounts for 55% to 95% of a software system's
Total cost [10] is crucial. Lower complexity enables team members who join the project post-release to be productive. Developers spend 70% of their time understanding code [11][12], so maintaining low complexity significantly impacts the maintenance team's productivity.

## Features checklist

### Code transformation (advising)

The main role of an aspect is to transform code. Therefore, the most critical factor when choosing an AOP framework is the kind of code transformation it supports. The more transformations supported, the more complex patterns you can automate.

Here are the advice kinds supported by Metalama:

- Overriding existing type members (including non-virtual, non-interface members).
- Introducing new members to an existing type.
- Introducing new types.
- Implementing new interfaces in existing types.
- Appending parameters to constructors and pulling (required for dependency injection).

### Design-time support

In the past, you had to build your project to refresh errors and warnings. IDEs have come a long way and now provide real-time feedback to developers while typing.

If your aspect introduces new members, types, or interfaces, it's often useful to reference them in _source_ code. If the new member is generated as a post-compilation step, this is not possible. Only Roslyn-based frameworks can bring the modern development experience to aspect-oriented programming.

### Error reporting

A secondary but important role of aspects is to report warnings and errors. For instance, you might want to report an error if the developer tries to use your caching aspect on a `void` method.

As a bonus, look for the ability to suggest a code fix when you report a warning.

### Targeting mechanisms

How will you choose which types, methods, or properties your aspects will apply to?

Metalama supports the following mechanisms:

* **Custom attributes**: You hand-pick the target declarations and add aspects as custom attributes.
* **Inheritance**: Aspects applied to a base type or member automatically apply to derived types and overriding members.
* **Programmatically**: Aspects can be added using a compile-time C# API that lets you query the code model using a familiar LINQ-style API.

Other frameworks (including PostSharp) may also support adding aspects using a compile-time XML file, but we found this approach less practical than the purely programmatic one when designing Metalama.

### Debugging experience

Can you still meaningfully debug your code after you enhance it with aspects? Can you debug the _generated_ code, or just the _source_ code?

With Metalama, the default debugging experience is to debug the _source_ code, meaning you will step into the source code but step over the generated code. However, by switching to the `LamaDebug` configuration, you will be able to step into every line of code generated by the aspect.

### Testing

How can you test that your aspects are working as expected? Do they consistently generate the code you expect? Do they report expected errors and warnings upon invalid code?

Metalama provides a test framework that allows you to test that the generated code is as expected.

### IDE tooling

The aim of aspect-oriented programming is to get the boilerplate out of sight and keep the source code clean.

However, to understand the code, it's often useful to know _that_ an aspect affects your class or method, even if you don't want to be always bothered by _how_ it is affected, i.e., you don't want to always see the generated code.

Metalama integrates with CodeLens, so you always get a hint when an aspect is applied to your code. If you want to see exactly how your code is affected, you can always open the _diff_ comparing your source code with the generated code.
