---
title: ToString
summary: "Learn how to use Metalama to automatically generate ToString methods for C# classes, improving debugging and logging with customizable formatting options."
keywords:
- c# tostring
- c# ToString
- c# string representation
- c# debugging
- c# logging
- metalama tostring
- automatic toString
- toString generation
- object toString
- toString override
---

{: .intro }
A well-crafted `ToString` implementation can significantly enhance your productivity during debugging and log analysis. Typically, it should return a concise description of the object, highlighting its identity and state. With Metalama, you can bypass writing this repetitive code manually.

## Example

Let's explore the [ToString example aspect](https://doc.metalama.net/examples/tostring/tostring-1) and apply the `[ToString]` aspect to a class. In this scenario, we adopt an opt-out approach, marking members with `[NotToString]` that we prefer to exclude.

```csharp
// [<focus>]
[ToString]
// [<endfocus>]
internal class MovingVertex
{
    public double X { get; set; }

    public double Y { get; set; }

    public double DX { get; set; }

    public double DY { get; set; }

    // [<focus>]
    [NotToString]
    // [<endfocus>]
    public double Velocity => Math.Sqrt((this.DX * this.DX) + (this.DY * this.DY));
}
```

The aspect generates the following code:

{% raw %}
```csharp
public override string ToString()
{
    return $"{{MovingVertex DX={DX}, DY={DY}, X={X}, Y={Y}}}";
}
```
{% endraw %}

Modifying the code generation pattern is straightforward. Simply adjust the aspect class itself, `ToStringAttribute`.

## Resources

- Commented example: [ToString](https://doc.metalama.net/examples/tostring/tostring-1)
