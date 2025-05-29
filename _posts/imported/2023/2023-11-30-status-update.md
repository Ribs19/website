---
layout: post
comments: false
title: "Metalama Status Update, November 2023"
date: 2023-11-30 08:00:01 +01:00
categories: [Status Update]
permalink: /blog/metalama-status-update-2023-11
origin: https://blog.postsharp.net/metalama-status-update-2023-11
author: "Gael Fraiteur"
image: /assets/images/2023/2023-11-30-status/november.png
summary: "The Metalama team has released the first stable version of Metalama 2023.4, and two previews of Metalama 2024.0, focusing on .NET 8.0 and C# 12 support. The General Availability (GA) release of Metalama 2024.0 is planned for the first week of January 2024."
---

After a bustling month of October filled with announcements, November has seemed relatively quieter. The team has been focused on upgrading both PostSharp and Metalama to .NET 8.0 and C# 12. Precision work without bells and whistles.

## Metalama 2023.4 GA

We released the first stable version of Metalama 2023.4, which features a versatile [options framework](https://doc.metalama.net/conceptual/aspects/configuration) for configuring aspects through custom attributes or specific fabric-based APIs. We have finished and released three open-source aspect libraries: [code contracts](https://doc.metalama.net/patterns/contracts), [caching](https://doc.metalama.net/patterns/caching), and [memoization](https://doc.metalama.net/patterns/memoization). We have also started work on an [observability aspect](https://doc.metalama.net/api/metalama_patterns_observability_observableattribute) that implements `INotifyPropertyChanged`. Moreover, we have ensured that the v18.8 update of Visual Studio did not disrupt Metalama.

[For more details, see this blog post.](https://metalama.net/blog/metalama-2023-4-ga)

## Metalama 2024.0 Previews

We have released two previews of Metalama 2024.0, focusing on .NET 8.0 and C# 12 support. We have merged Roslyn 4.8 into [Metalama.Compiler](https://github.com/metalama/Metalama.Compiler), now open-source.

We are working on supporting C# 12 features. Here is the current status:

-  ✔️  Default lambda parameters
-  ✔️ [Inline arrays](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12#inline-arrays)  in run-time code
-  ✔️ Allow nameof always to access instance members from a static context
-  ✔️ Primary constructors
-  ✔️ Type aliases
-  ❌  [Inline arrays](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12#inline-arrays) in compile-time code
-  ❌ Collection expressions (aka collection literals) like `[1,2,..array]`
-  ❌  `AppendParameter` advice (used in dependency injection scenarios) in primary constructors

Metalama 2024.0 will be the first version to support multiple versions of the C# language. For some features, it will use different code patterns according to the target language of your project.

At the time of writing, we are still completing the final work items before the RC. We expect to release a final preview build in a couple of days; then, we will proceed to manual testing and finally publish the RC.

The General Availability (GA) release of Metalama 2024.0 is planned for the first week of January 2024.

For more details about this branch, see the changelogs:

- [2024.0.2-preview](https://github.com/orgs/metalama/discussions/241)
- [2024.0.1-preview](https://github.com/orgs/metalama/discussions/238)

Real enthusiasts can also look at the list of [unpublished commits](https://github.com/metalama/Metalama.Framework/compare/HEAD...develop/2024.0).

## PostSharp 2024.0 Preview

We have released a second preview of PostSharp 2024.0, which supports .NET 8.0, C# 12, and ARM64 -- both on Linux and Windows! We've also updated dependencies with reported security vulnerabilities.

We are sunsetting our aspect serializer based on `BinaryFormatter`, and are instead generalizing the use of our custom serializer.

Just like Metalama, we expect PostSharp 2024.0's final preview in a couple of days, an RC right after manual testing, and a GA during the first week of January 2024.

For a complete changelog, see the [release notes](https://www.postsharp.net/downloads/postsharp-2024.0/v2024.0.2/PostSharp-ReleaseNotes-2024.0.2-preview).

## Roadmap

During the first week of December, we will finalize both Metalama and PostSharp 2024.0, which primarily entails performing happy path tests on various software and hardware platforms.

Our focus will then shift to Metalama and PostSharp 2024.1. One of our objectives for this release is to merge the Visual Studio extensions of both products into a single extension, as their features significantly overlap from a UX perspective.

We will also dedicate several weeks to performance optimizations of Metalama.

Another lower-priority objective is to complete several user stories around advising constructors.

We're also considering finishing the work with the [observability](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Observability) and [XAML](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Xaml) aspects.

## Summary

This month was primarily about .NET 8.0 and C# 12 compatibility. You can expect final previews of both Metalama and PostSharp 2024.0 in a couple of days, then release candidates shortly after, and General Availability releases in the first days of January.

Happy meta-programming!

  

