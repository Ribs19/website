---
title: Memoization
summary: "Memoization improves app performance by storing read-only property values, avoiding re-evaluation. Use Metalama.Patterns.Memoization for easy implementation."
keywords: "memoization, read-only property, Metalama.Patterns.Memoization, app performance, high-performance, multi-threading, Memoize aspect, property evaluation"
---
{: .intro }
In high-performance apps or components, [memoization](https://doc.metalama.net/patterns/memoization) is the technique of "remembering" the value of a read-only property of an object to avoid subsequent evaluations. Memoization is helpful when a property always returns the same value for the same object. Unlike caching, memoization does not rely on an external caching component or a string-based key but is implemented directly in the property, making it very fast.

High-performance implementations of the memoization pattern can be tricky to implement due to multi-threading issues.

The [Memoize](https://doc.metalama.net/patterns/memoization) aspect from the `Metalama.Patterns.Memoization` package makes this process trivial, effectively turning a standard read-only property into a memoized one without any boilerplate.

{: .note }
`Metalama.Patterns.Memoization` is a production-ready, professionally-supported, and open-source aspect library. <i class="supported no-tooltip"></i>

{: .note }
Available for all UI frameworks.

## Benefits

* Improve your application's performance.
* Avoid common mistakes in implementing the memoization code pattern.
* Keep your code clean and concise.

## Example

In the following snippet, the `PatternBrush` property is memoized, ensuring it is created only once.

```csharp
public class ExpensiveResourceViewModel : DependencyObject
{
    // [<focus>]
    [Memoize]
    // [<endfocus>]
    public VisualBrush PatternBrush => new VisualBrush
    {
        TileMode = TileMode.Tile,
        Viewport = new Rect(0, 0, 20, 20),
        ViewportUnits = BrushMappingMode.Absolute,
        Visual = CreatePatternVisual()
    };

    private DrawingVisual CreatePatternVisual()
    {
        var visual = new DrawingVisual();
        using (var context = visual.RenderOpen())
        {
            context.DrawRectangle(Brushes.LightGray, null, new Rect(0, 0, 20, 20));
            context.DrawLine(new Pen(Brushes.Blue, 2), new Point(0, 0), new Point(20, 20));
            context.DrawLine(new Pen(Brushes.Blue, 2), new Point(20, 0), new Point(0, 20));
        }
        return visual;
    }
}
```

## Resources

* Reference documentation: [Memoization](https://doc.metalama.net/patterns/memoization).
* Source code: [Metalama.Patterns.Memoization](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Memoization).
* NuGet package: [Metalama.Patterns.Memoization](https://www.nuget.org/packages/Metalama.Patterns.Memoization).
