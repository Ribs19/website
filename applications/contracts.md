---
title: Defensive Programming
summary: "Defensive Programming uses redundant validation checks to enhance software robustness, streamlined by Metalama's automatic code generation."
keywords: "defensive programming, redundant validation checks, Metalama, automatic code generation, software robustness, validation code, .NET, Metalama.Patterns.Contracts, code contracts, user input validation"
---

{: .intro }
**Defensive Programming** emphasizes adding redundant validation checks—such as preconditions, postconditions, and invariants—to ensure software remains robust against unexpected inputs or failures. Defensive programming prevents the propagation of defects from one component to another, making it easier to trace exceptions to their root cause.

Manually implementing these practices is often labor-intensive due to the need for repetitive boilerplate code. Metalama streamlines this process by automatically generating validation code, enabling developers to reap its benefits without the associated overhead.

Metalama [Code Contracts](https://doc.metalama.net/patterns/contracts), implemented in the `Metalama.Patterns.Contracts` package, are a simple mechanism to validate the value assigned to properties, fields, or parameters.

When applied to Model or ViewModel properties, code contracts can be used to implement _user input validation_. Unlike the [System.ComponentModel.DataAnnotations](https://learn.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations) namespace, Metalama's code contracts can be applied to _any_ class and not just ASP.NET ones.

{: .note }
`Metalama.Patterns.Contracts` is a production-ready, professionally-supported, and open-source aspect library. <i class="supported no-tooltip"></i>

## Example

The following snippet shows contracts applied to properties of the `Customer` class.

```csharp
public class Customer
{
    // [<focus>]
    [Phone]
    // [<endfocus>]
    public string? Phone { get; set; }

    // [<focus>]
    [Url]
    // [<endfocus>]
    public string? Url { get; set; }

    // [<focus>]
    [Range( 1900, 2100 )]
    // [<endfocus>]
    public int? BirthYear { get; set; }

    public string? FirstName { get; set; }

    // [<focus>]
    [Required]
    // [<endfocus>]
    public string LastName { get; set; }
}
```

Here we have a contract applied to an `out` parameter.

```csharp
public interface ICustomerService
{
    // Returns the name of a given customer or null if it cannot be found,
    // but never returns an empty string.
    bool TryGetCustomerName( int id, [NotEmpty] out string? name );
}
```

This code will check the value of _all_ non-nullable parameters in the current project.

```csharp
internal class Fabric : ProjectFabric
{
    public override void AmendProject( IProjectAmender amender )
    {
        amender.VerifyNotNullableDeclarations();
    }
}
```

## Benefits

* Validate user inputs while keeping your code concise and readable.
* Implement defensive programming and prevent the propagation of bugs from one component to another.

## Features

* Preconditions: input parameter values, field/property setter values.
* Postconditions: output parameter values, return values, property getter values.
* Invariants: method executed before exiting any public method.
* Global null-checking with one line of code thanks to fabrics.
* Customizable and localizable: change the `throw` statement at will.

## Resources

* Reference documentation: [Code Contracts](https://doc.metalama.net/patterns/contracts).
* Source code: [Metalama.Patterns.Contracts](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Contracts).
* NuGet package: [Metalama.Patterns.Contracts](https://www.nuget.org/packages/Metalama.Patterns.Wpf).
