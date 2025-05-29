---
summary: "Metalama is a tool for architecture verification, ensuring that your C# codebase complies with the intended software architecture."
title: "Architecture Verification for .NET"
short_title: "Architecture Verification"
keywords:
- architecture verification
- software architecture verification
---

{: .intro }
Architecture is often defined in non-executable forms such as text and diagrams. Since it cannot be automatically enforced, it is verified during _code reviews_, which can be slow and frustrating for both sides. As a result, the _real_ architecture of the code departs from the _intended_ one, a phenomenon known as _architecture erosion_.

{: .intro }
Metalama lets you validate code **usages**, **references**, and **dependencies**, enabling you to enforce architectural rules directly in code — a concept we call **Architecture as Code**.

{: .note }
This feature requires a Metalama Professional license.

Metalama is the only C# tool that lets you define rules tailored to your architecture and business domain and enforce them in the IDE with real-time feedback.

Expressing architecture in an _executable_ way allows you to validate the codebase in real-time. Most issues can be identified and resolved immediately, making code reviews smoother and less focused on mundane issues.

Typically, the following rules can be automatically enforced in a codebase:

- Restrict dependencies between classes, class families, and namespaces.
- Verify naming conventions based on the base class or implemented interface.
- Ensure that code is implemented according to pattern guidelines.

## Benefits

Here are five reasons why you _must_ consider automatically verifying your codebase against your design:

- **Stop architecture decay.** Keep your code aligned with the defined blueprints. Your codebase retains its initial architectural qualities, allowing for low maintenance costs and the ability to implement new requirements. The _broken window_ syndrome stops and reverses.

- **Reduce codebase complexity.** By validating not only the high-level architecture but also implementation patterns and other coding conventions, you further reduce the complexity of your codebase, making it easier for software developers to understand.

- **Scale expertise.** Instead of repeatedly pointing out the same issues in code reviews, architects can codify their guidance once and apply it everywhere, instantly.

- **Get immediate feedback.** Developers receive real-time notifications of issues while typing, eliminating the need to wait for the next build or code review.

- **Streamline code reviews.** With fewer trivial violations to address, code reviews become more efficient and less frustrating. By addressing most minor issues in real time, code reviews can focus on essential aspects.

If they can author your architecture as executable code, architects stop being gatekeepers and start accelerating the entire team.

## Features

### Custom attributes: hand-pick declarations

Here is how to enforce a naming convention where all classes implementing `IDocumentFactory` must be suffixed `Factory`:

```csharp
[DerivedTypesMustRespectNamingConvention( "*Factory" )]
public interface IDocumentFactory
{
    IDocument CreateDocument( DocumentId documentId );
}
```

In the following snippet, we prevent the constructor of the `Invoice` class from being used from a different type than `InvoiceFactory`, enforcing the Factory pattern.

```csharp
public class Invoice
{
    [CanOnlyBeUsedFrom( Types = [ typeof(InvoiceFactory) ] ) ]
    public Invoice( DocumentId documentId ) { }
}
```

### Fabrics: select in bulk

The following code enforces that `internal` members of the current namespace are not used by a different namespace.

```csharp
namespace MyNamespace;

internal class Fabric : NamespaceFabric
{
    public override void AmendNamespace( INamespaceAmender amender )
    {
        amender.InternalsCanOnlyBeUsedFrom( r => r.CurrentNamespace() );
    }
}
```

Here we are using a project fabric to check that floating-point numbers are not used in the Invoicing namespace.

```csharp
internal class Fabric : ProjectFabric
{
    public override void AmendProject( IProjectAmender amender )
    {
        amender
            .SelectReflectionTypes( typeof(float), typeof(double) )
            .CannotBeUsedFrom(
                r => r.Namespace( "**.Invoicing" ),
                "Use decimal numbers instead." );
    }
}
```

### Behaves like native C# warnings

Warnings reported by Metalama behave like native C# warnings.

This has several benefits:

- They are represented by the familiar squiggles directly in the code editor.
- They can be suppressed or escalated using `#pragma warning`, `.editorconfig`, or `WarnAsError`.
- They can be managed by tools like Sonar or Qodana.

### Immediate editor feedback

Metalama runs within the IDE and verifies your code as you type.

You receive feedback in seconds. No need to wait for a build or the CI/CD pipeline to complete.

### Understands aspects

Other verification tools may fail to understand the code after it has been enhanced by aspects. Metalama Architecture Validation is, of course, fully integrated with the Metalama Aspect Framework.

## Resources

- Reference documentation: [Verifying architecture](https://doc.metalama.net/conceptual/architecture).
- Source code: [Metalama.Extensions.Architecture](https://github.com/metalama/Metalama.Extensions/tree/HEAD/src/Metalama.Extensions.Architecture)
- NuGet package: [Metalama.Extensions.Architecture](https://www.nuget.org/packages/Metalama.Extensions.Architecture)
