---
title: "Factory Patterns"
summary: "Factory and Abstract Factory patterns create objects without exposing logic, using Metalama for architecture verification."
keywords: "Factory pattern, Abstract Factory pattern, Metalama, architecture verification, factory method, design patterns, .NET, object creation, creational design patterns"
---

The Factory and Abstract Factory are creational design patterns used to create objects without exposing the creation logic to the client. The main difference between the Factory and Abstract Factory is that the Factory pattern is a single method that creates objects, while the Abstract Factory is a super-factory that creates other factories.

Although Metalama can be used to create a Factory aspect that generates a factory method for a class (or even an Abstract Factory class), it's generally not worth the effort unless you have a large number of highly trivial factories that just call the constructor.

Instead, you can use [Metalama Architecture Verification](https://doc.metalama.net/conceptual/architecture) to verify that no code except the factories directly calls the constructor. By doing this, you're making the design intent _explicit_ and _executable_, reporting warnings in real-time in case of violation.

## Example

Suppose we have a base interface `IShape` and want to verify that only the `ShapeFactory` class can create instances of the interface. We can add a `[UseFactory]` aspect to it.

```cs
// [<focus>]
[UseFactory( typeof(ShapeFactory) )]
// [<endfocus>]
public interface IShape
{
    public Color Color { get; }
}
```

It automatically applies to derived types:

```csharp
public class Circle : IShape
{
    public Circle( double radius, Color color )
    {
        Radius = radius;
        Color = color;
    }

    public double Radius { get; }
    public Color Color { get; }
}
```

We now get a warning whenever we try to directly use the constructor:

```csharp
Drawing CreateDrawing()
{
    // [<warning>]
    // WARNING! Use ShapeFactory to get an instance of this class.
    // [<endwarning>]
    var circle = new Circle( 1.1, Color.Red );

    return new Drawing { circle };
}
```

{: .show-more }
Show me how it works!

The `UseFactoryAttribute` class is an inheritable aspect that verifies that constructors of derived types are used only from a given type or from a unit test.

```cs
[Inheritable]
internal class UseFactoryAttribute : TypeAspect
{
   private readonly Type _factoryType;

   public UseFactoryAttribute( Type factoryType )
   {
      this._factoryType = factoryType;
   }

    public override void BuildAspect( IAspectBuilder<INamedType> builder )
        => builder.Outbound.SelectMany( t => t.Constructors )
            .CanOnlyBeUsedFrom(
                scope => scope.Namespace( "**.Tests" )
                    .Or()
                    .Type( this._factoryType ),
                $"Use '{this._factoryType.Name}' to get an instance of this class." );
}
```

## Metalama benefits

* **Reduce human errors**. You can be confident that no rogue code is calling the constructor directly instead of getting an instance from the DI container.

![](/assets/images/solutions/factory-validation.png)

## Resources

* Blog post: [The Factory design pattern in C#](https://metalama.net/blog/factory-pattern)
