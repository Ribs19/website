---
title: Equality Comparison
summary: "Discover how Metalama automates C# equality comparison implementation, generating IEquatable<T>, GetHashCode, and operators to eliminate boilerplate code."
keywords:
- c# equality
- c# equatable
- c# IEquatable
- c# equals
- c# gethashcode
- c# equality operators
- c# equality comparison
- metalama equality
- equals override c#
- equality pattern c#
---

{: .intro }
There are times when .NET's default equality comparers are sufficient, but when they fall short, crafting a custom one means writing a host of class members—it's all repetitive code. With Metalama, simply mark the types or members that need an equality contract, and the code will be automatically generated during compilation.

You might think implementing the `IEquatable<T>` interface is enough, but for a consistent equality pattern, you must:

- Add the `IEquatable<T>` interface to the type.
- Implement the `Equals(T)` public method.
- Override the default `Equals(object)` method.
- Override the default `GetHashCode()` method.
- Add `==` and `!=` operators.

With Metalama, all this can be generated using a single custom attribute.

## Examples

In this example, the aspect generates code for the Equatable pattern whenever it detects an `[EqualityMember]` attribute in your code.

For instance, you want two instances of the `Person` class to be uniquely identified by their `Id` property.

```csharp
internal partial class Person
{
    // [<focus>]
    [EqualityMember]
    // [<endfocus>]
    public int Id { get; init;}

    public string? Name { get; init; }

    public DateTime DateOfBirth { get; init; }
}
```

Metalama generates the following code in the background:

```csharp
using System;
using System.Collections.Generic;

namespace Metalama.Samples.Comparison1;

internal partial class Person
    // [<added>]
    : IEquatable<Person>
    // [<endadded>]
{
    // [<added>]
    public bool Equals(Person other)
    {
        if (other == null)
        {
            return false;
        }

        if (object.ReferenceEquals(this, other))
        {
            return true;
        }

        if (!EqualityComparer<int?>.Default.Equals(Id, other.Id))
        {
            return false;
        }

        return true;
    }

    public override bool Equals(object? other)
    {
        if (object.ReferenceEquals(this, other))
        {
            return true;
        }

        return other is Person typed && Equals(typed);
    }

    public override int GetHashCode()
    {
        var hashCode = default(HashCode);
        hashCode.Add(Id, EqualityComparer<int>.Default);
        return hashCode.ToHashCode();
    }

    public static bool operator ==(Person a, Person b)
    {
        return a == null && b == null || a != null && a.Equals(b);
    }

    public static bool operator !=(Person a, Person b)
    {
        return a == null ^ b == null || a != null && !a.Equals(b);
    }
    // [<endadded>]
}
```

The new members are also generated at design time, so IntelliSense will recognize their existence.

## Resources

- Commented example: [Equatable](https://doc.metalama.net/examples/comparison)
