---
layout: new-post
comments: false
title: "Metalama Status Update, May 2024"
date: 2024-05-30 08:00:01 +01:00
categories: [Status Update]
permalink: /blog/metalama-status-update-2024-05
origin: https://blog.postsharp.net/metalama-status-update-2024-05
author: "Gael Fraiteur"
image: /assets/images/2024/2024-05-status/featured-dark.svg
thumbnail: /assets/images/2024/2024-05-status/featured.svg
summary: "In May 2024 we mainly worked on type and constructor introductions, with our first successful implementations of the Memento pattern. We also added tons of smaller features to the Metalama API. We started a new blog, the Timeless .NET Engineer."
---
Have you ever experienced that surprising feeling when, looking at day-to-day progress during standup meetings, you lament the lack of progress, but when the time comes for a monthly digest, you're amazed by the total achievements? This month is no exception. We've seen lots of releases and new features, and a rebirth of our marketing effort after a 3-year hiatus.

## PostSharp 2024.0 Is Now LTS

We've promoted the PostSharp 2024.0 release to Long-Term Support status. This version will be supported until January 4, 2029, or 1 year after a future version is promoted to LTS. Support for the previous LTS, PostSharp 6.10, will end on May 1, 2025.

## Bugfixing Releases

We've published several bug-fixing releases for Metalama 2024.0 and 2024.1 and PostSharp 6.10, 2024.0, and 2024.1.

For details, please refer to the [Metalama changelogs](https://github.com/orgs/metalama/discussions/categories/changelog) or the [PostSharp release notes](https://www.postsharp.net/downloads/postsharp/postsharp-2024.1/v2024.1.4/PostSharp-ReleaseNotes-2024.1.4).


## Work in Progress in Metalama 2024.2

We've made a lot of progress in Metalama 2024.2, which is now almost code-complete. Here are the new features and improvements this month.

### Introduction of classes and constructors

This is the most significant feature since we released 2023.0 last year!

It's now possible to introduce whole classes by using the `IAdviceFactory.IntroduceClass` method. This method returns an `IAdviser<INamedType>`, which you can then use to add members to the new type.

We've added the `IAdviceFactory.IntroduceConstructor` and `IAdviser<INamedType>.IntroduceConstructor` extension method to introduce a constructor into an existing or new type.

There are still some limitations we are working on: you can currently only add nested types, but you cannot add top-level types to a namespace.

To see class introduction in action, see our [Memento](https://github.com/metalama/Metalama.Framework/blob/HEAD/tests/Metalama.Framework.Tests.Integration/Tests/Aspects/Samples/Memento.cs) example and its [generated code](https://github.com/metalama/Metalama.Framework/blob/HEAD/tests/Metalama.Framework.Tests.Integration/Tests/Aspects/Samples/Memento.t.cs).

By the way, `IAdviser<T>` and its extension methods are the new way to add advice to a declaration. The `IAspectBuilder<T>` interface derives from `IAdviser<T>`. For instance, if you have an `IAspectBuilder<INamedType>`, you can do `builder.IntroduceMethod(...)` instead of `builder.Advice.IntroduceMethod( builder.Target, ...)`.


### Code model improvements

* We've added support for lambda statements and anonymous methods of known scope, i.e., either run-time or compile-time (the scope can be coerced using `meta.RunTime` or `meta.CompileTime` when it's not obvious from the context). Lambda expressions returning `dynamic` are not supported and won't be. Single-statement lambdas (e.g., `() => { return 0; }`) are transparently simplified into expression lambdas (e.g., `() => 0`).
* We've added the `Promise<T>` class and `IPromise<T>` interface to represent results that are not available yet. This mechanism allows resolving chicken-or-egg issues when introducing members when a template must receive a reference to a declaration that has not been introduced yet. A `Promise<T>` can be passed as an argument to a template, which receives it on a parameter of type `T`.
* We've added the `IMethodInvoker.CreateInvokeExpression` method to generate an `IExpression` that represents a method invocation. It can be called outside of a template context.
* We've added the `IConstructorInvoker` interface with methods `Invoke` and `CreateInvocationExpression`, so it's now possible to easily create object-creation expressions.


### Code formatting improvements

* Where applicable, redundancies in member access expressions are eliminated (e.g., `this.X` or `MyType.Y` becomes `X` or `Y`).
* Non-extension calls to extension methods in templates are transformed into extension calls. This is useful because extension methods cannot be called on dynamic types. For instance, the C# code `LoggerExtensions.LogInformation( meta.This._logger, "Hello" )` would compile to `_logger.LogInformation( "Hello" )`.
* The discard parameter `_`, when used in templates, is no longer renamed to `__1`, `__2`, and so on.

* The performance of whole-project output code formatting has been improved. Note that code formatting is disabled by default so it should not affect your standard builds, but `LamaDebug` builds should be faster.

### Observable and XAML aspects

* We've refactored the `[Observable]`, `[Command]`, and `[DependencyProperty]` aspects, which are now almost RTM-ready. This work triggered many of the improvements listed above.


## The Metalama logo got two awards!

<img src="/assets/images/2024/2024-05-status/award.jpg"/>

Our logo received two gold medals this month, one from the [Indigo Award](https://indigoaward.com/winners/8945) and the second from the [Titan Brands](https://titanbrandawards.com/winner-info.php?id=79). Congratulations to the logo designer [James Barnard](https://barnard.co/) for a wonderful creation. I knew James was an award-winning designer, but I didn't expect him to win an award with _our_ logo.


## Timeless .NET Engineer series

We've launched the Timeless .NET Engineer blog and newsletters.

The goal of this series is to educate .NET developers about building robust and maintainable applications, with clean code. Metalama is often mentioned as a possible solution, but none of the articles will be product-centric.

This month, we released two articles:

<div class="article-thumbnails">
    <a href="/blog/nullreferenceexception-object-reference-not-set">
         <img src="/assets/images/2024/2024-04-12-method-decorators/decorator.svg" alt="The Decorator Pattern in Modern C#"/>
    </a>
    <a href="/blog/decorator-pattern">
        <img src="/assets/images/2024/2024-04-16-nullreferenceexception/nullreference.svg" alt="How to Deal With NullReferenceException"/>
    </a>
</div>


You can subscribe to this newsletter [here](https://newsletter.postsharp.net/).

We're welcoming guest authors. Don't hesitate to contact us.

Moreover, now that the ChatGPT frenzy has attenuated, we're departing from AI-generated images on this blog, and opting for hand-crafted minimalistic illustrations instead. I chose to stick with playful seasonal images for the monthly images, contrasting with the very seriousness of our business, and hope you will enjoy.


## Roadmap

We will continue working on 2024.2 in June, finishing the work on type introductions. Two features will make it to 2024.2: introducing types into a namespace (instead of nesting it into another type), and an extension to the Aspect Explorer UI to display generated files. We still have to document the `[Observable]`, `[Command]` and `[DependencyProperty]` aspects. Therefore, we plan to have a GA release by the first half of July.

Most of the summer should be dedicated to completing the gaps left in type introductions (such as introducing structs, records, primary constructors), to fixing bugs and, of course, taking some time off with our families. Then, by September or October, we'll get prepared for .NET 9.

At the same time, we'll steam up our marketing effort and publish more general articles.

## Conclusion

We're really excited by the upcoming Metalama 2024.2 release, which closes the last feature gaps with Roslyn source generators and opens the door to very productive aspects.  Stay tuned for updates, and don't forget to share any feedback you may have on [Slack](https://www.postsharp.net/slack).

