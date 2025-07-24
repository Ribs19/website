---
title: Cloning
---

{: .intro }
While the .NET runtime provides a fast and convenient implementation for shallow cloning in the `object.MemberwiseClone` method, deeply cloning an object tree requires a lot of repetitive code, adding costs and bugs to your app. This is one of the many patterns you can completely automate with Metalama.

Making an object deeply clonable typically involves the following steps:

- Add the `ICloneable` interface to the type.
- Add a method `public T Clone()` and implement it, typically calling `MemberwiseClone` and then invoking the `Clone` method for each field of a cloneable type.
- Implement `object ICloneable.Clone()` as an explicit interface implementation, calling the public `Clone` method.

Most of the time, this is purely algorithmic work.

## Example

The [Cloneable example aspect](https://doc.metalama.net/examples/clone) implements all the steps above, and more. It requires you to mark the fields you want to clone with the `[Child]` custom attribute, but you can edit the aspect code to change this behavior.

You can apply this to any class:

```csharp
[Cloneable]
class Game
{
    public Player Player { get; set; }

    [Child]
    public GameSettings Settings { get; set; }
}
```

During compilation, the following code will be generated:

```csharp
using System;

[Cloneable]
class Game : ICloneable
{
    public Player Player { get; set; }

    [Child]
    public GameSettings Settings { get; set; }

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
}
```

If you make the class `partial`, Metalama will also generate the code at design time, you that Intellisense will "see" that `Game` implements `ICloneable` and has a `Clone` public method.

## Resources

- Commented example: [Deep Cloning](https://doc.metalama.net/examples/clone)