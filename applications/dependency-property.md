---
title: Dependency Properties
summary: "Metalama.Patterns.Wpf is an open-source library for WPF, enhancing productivity by generating dependency properties without boilerplate code."
keywords: "dependency properties, boilerplate code, Metalama.Patterns.Wpf, WPF, C# automatic properties, productivity, open-source library, validation rules, OnPropertyChanged callbacks"
---

{: .intro }
Dependency properties enable advanced property behaviors such as data binding, animation, and styling. However, implementing dependency properties in WPF often requires writing repetitive and error-prone boilerplate code, which can slow down development and introduce bugs.

{: .intro }
`Metalama.Patterns.Wpf` addresses this issue by allowing developers to generate dependency properties directly from C# automatic properties. This eliminates the need for boilerplate code, boosts productivity, and ensures cleaner, more maintainable code.

{: .note }
`Metalama.Patterns.Wpf` is a production-ready, professionally supported, and open-source aspect library. <i class="supported no-tooltip"></i>

{: .note }
Available for WPF only.


## Example

```csharp
public partial class FancyTextBlock : UserControl
{
    public FancyTextBlock()
    {
        InitializeComponent();
    }

    // [<focus>]
    [Required]
    [DependencyProperty]
    // [<endfocus>]
    public string Text { get; set; } = "Hello, world.";

    // [<focus>]
    [DependencyProperty]
    // [<endfocus>]
    public Brush FancyBorderBrush { get; set; }

    public void OnFancyBorderBrushChanged() { /* Handle changes here. */}
}
```

## Benefits

* **Boost your productivity**. Generate dependency properties from C# automatic properties without boilerplate code.
* **Reduce human errors**. Eliminate repetitive code that is prone to mistakes.
* **Improve maintainability**. Keep your codebase clean and easier to understand.
* **Seamless integration**. Works with existing WPF projects without requiring major refactoring.
* **Customization**. Easily add validation rules or `OnPropertyChanged` callbacks tailored to your needs.

## Features

* Integrates with [Metalama.Patterns.Contracts](https://doc.metalama.net/patterns/contracts) to set validation rules without reinventing the wheel.
* Fully customizable: add your own validation or `OnPropertyChanged` callbacks.


## Resources

* Blog post: [Implementing WPF Dependency Properties with Metalama](https://metalama.net/blog/wpf-dependency-property-metalama).
* Reference documentation: [WPF Dependency Properties](https://doc.metalama.net/patterns/wpf/dependency-property).
* Source code: [Metalama.Patterns.Wpf](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Wpf).
* NuGet package: [Metalama.Patterns.Wpf](https://www.nuget.org/packages/Metalama.Patterns.Wpf).

