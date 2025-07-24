---
title: Cloning
summary: "Learn how to use Metalama to automatically implement deep cloning for C# objects, eliminating repetitive ICloneable code and reducing bugs."
keywords:
- c# clone
- c# cloning
- c# deep clone
- c# ICloneable
- c# object cloning
- metalama cloning
- deep copy c#
- object deep copy
- automatic cloning
- clone pattern c#
---

{: .intro }
The .NET runtime offers a quick and easy method for _shallow_ cloning with `object.MemberwiseClone`. However, deeply cloning an object tree usually involves a lot of repetitive code, which can add both cost and bugs to your application. This is one of the many patterns you can fully automate with Metalama.

To make an object deeply clonable, you typically need to:

- Implement the `ICloneable` interface for the type.
- Add a method `public T Clone()` and implement it, usually by calling `MemberwiseClone` and then invoking the `Clone` method on each field of a clonable type.
- Implement `object ICloneable.Clone()` as an explicit interface implementation, which calls the public `Clone` method.

Most of the time, this is purely algorithmic work.

## Example

The [Cloneable example aspect](https://doc.metalama.net/examples/clone) covers all the steps mentioned above, and more. It requires you to mark the fields you wish to clone with the `[Child]` custom attribute, but feel free to modify the aspect code to change this behavior.

You can apply this to any class:

```csharp
// [<focus>]
[Cloneable]
// [<endfocus>]
class Game
{
    public Player Player { get; set; }

    // [<focus>]
    [Child]
    // [<endfocus>]
    public GameSettings Settings { get; set; }
}
```

During compilation, the following code will be generated:

```csharp
using System;

[Cloneable]
class Game
// [<added>]
    : ICloneable
// [<endadded>]
{
    public Player Player { get; set; }

    [Child]
    public GameSettings Settings { get; set; }

    // [<added>]
    public virtual Game Clone()
    {
        var clone = (Game)this.MemberwiseClone();
        clone.Settings = ((GameSettings)this.Settings.Clone());
        return clone;
    }

    object ICloneable.Clone()
    {
        return Clone();
    }
    // [<endadded>]
}
```

If you make the class `partial`, Metalama will also generate the code at design time. This means that Intellisense will "see" that `Game` implements `ICloneable` and includes a public `Clone` method.

## Resources

- Commented example: [Deep Cloning](https://doc.metalama.net/examples/clone)
