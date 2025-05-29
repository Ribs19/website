---
title: "Fody"
summary: "Fody is an extensible tool for weaving .NET assemblies, offering open-source plugins and method decorators but has limitations in complexity and traceability."
keywords:
- fody
- c# fody
- fody .net
---

[Fody](https://github.com/Fody/Fody) is an extensible tool for weaving .NET assemblies. Manipulating the IL of an assembly as part of a build requires a significant amount of plumbing code. This plumbing code involves knowledge of both the MSBuild and Visual Studio APIs. Fody aims to eliminate that plumbing code through an extensible add-in model.

## What are Fody weavers?

Fody weavers are plug-ins to the Fody platform. They generally implement a single feature. Fody weavers are packaged separately from Fody itself.

## Fody strengths

- **Open-source plug-ins**: Fody offers a variety of open-source plugins, making it easier to implement common programming patterns. These plugins are user-friendly, with ConfigureAwait, PropertyChanged, and a resource-embedding tool being particularly popular.

- **Method decorators**: Fody's MethodDecorator simplifies the implementation of simple patterns.

## Fody limitations

- **Complexity**: Using existing plugins and method decorators is straightforward, but creating custom patterns at the MSIL level can be intricate, particularly for non-trivial applications.

- **Cannot reference new members from source code**: Since Fody processes output from the C# compiler, the source code cannot directly reference any members introduced by Fody.

- **Lack of aspect traceability**: The code transformations Fody applies aren't visible in the Integrated Development Environment (IDE). To view these changes, one must use a decompiler to examine the compiled application.

- **Complex but unsupported**: Both Fody and `Mono.Cecil`, the underlying library, are sophisticated yet lack support from a dedicated professional team, posing potential challenges in their use and maintenance.

## Fody alternatives

- [Metalama.Compiler](https://github.com/metalama/Metalama.Compiler) is a fork of Roslyn that adds an extension point allowing for arbitrary code modifications using the Roslyn code model instead of MSIL instructions.

- [Aspect-oriented frameworks](aspect-oriented-programming) for .NET are generally more powerful and simpler to customize than Fody add-ins.

- [Metalama](/) is the simplest and most powerful AOP framework for .NET. It can be extended using [Metalama.Framework.Sdk](https://doc.metalama.net/conceptual/sdk) to support code transformations using the Roslyn code model. [Metalama.Community.Costura](https://github.com/metalama/Metalama.Community/tree/HEAD/src/Metalama.Community.Costura) is a port of the popular `Costura.Fody` weaver built with `Metalama.Framework.Sdk`.
