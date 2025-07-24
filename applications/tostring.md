---
title: ToString
---

{: .intro }
Good `ToString` implementations boost your productivity while debugging and analyzing logs. It should typically return a compact description of the object, including its identity and state. In many types, `ToString` would include all fields and stateful properties. You can use Metalama to avoid writing this boilerplate code by hand.

## Example

Let's use the [ToString example aspect](https://doc.metalama.net/examples/tostring/tostring-1) and add the `[ToString]` aspect to a class. In this example, we follow an opt-out approach, and mark with `[NotToString]` the memers we don't want to be included.

```csharp
[ToString]
internal class MovingVertex
{
    public double X  { get; set; }

    public double Y  { get; set; }

    public double DX  { get; set; }

    public double DY { get; set; }

    [NotToString]
    public double Velocity => Math.Sqrt( (this.DX * this.DX) + (this.DY * this.DY) );
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

It's easy to change the code generation pattern. You just need to change a single class: the aspect itself, `ToStringAttribute`.

## ToString as a refactoring



## Resources

- Commented example: [ToString](https://doc.metalama.net/examples/tostring/tostring-1)