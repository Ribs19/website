---
layout: new-post
comments: false
title: "Implementing the Builder pattern with Metalama"
date: 2024-10-07 08:00:01 +01:00
categories:
    - The Timeless .NET Engineer
permalink: /blog/builder-pattern-with-metalama
origin: https://blog.postsharp.net/builder-pattern-with-metalama
author: "Metalama Team"
image: /assets/images/2024/2024-10-builder-1/builder-dark.svg
thumbnail: /assets/images/2024/2024-10-builder-1/builder-dark.svg
summary: "This article shows how to implement the Builder pattern automatically with Metalama. It starts discussing the implementation strategy, then comments the source code of the aspect."
source_url: https://github.com/metalama/Metalama.Samples/tree/HEAD/examples/builder/builder-1
related_articles:
    - /builder-pattern
---

The popularity of _immutable_ objects has made the Builder pattern one of the most important in C#. However, implementing the Builder pattern by hand is a tedious and repetitive task. Fortunately, because it is repetitive, it can be automated using a Metalama aspect. This is what we will explore in this article. We will start discussing the implementation strategy, then we will comment the source code of the Metalama aspect.

## Components of the Builder pattern

As with any pattern automation, the very first step is to describe how we would implement the process _by hand_. It's a good practice to start with a few code snippets _before_ transformation and to handwrite the code we want to generate. Once we think we have covered all the cases we can identify, we can reason about how to turn this into an algorithm.

### Features

A proper implementation of the Builder pattern should include the following features:

* A `Builder` constructor accepting all required properties.
* A writable property in the `Builder` type corresponding to each property of the build type. For properties returning an immutable collection, the property of the `Builder` type should be read-only but return the corresponding _mutable_ collection type.
* A `Builder.Build` method returning the built immutable object.
* The ability to call an optional `Validate` method when an object is built.
* In the source type, a `ToBuilder` method returning a `Builder` initialized with the current values.

### Examples

Let's start with a simple example:

```c#
[GenerateBuilder]
public partial class Song
{
    [Required] public string Artist { get; }

    [Required] public string Title { get; }

    public TimeSpan? Duration { get; }

    public string Genre { get; } = "General";
}
```

We want the `[GenerateBuilder]` aspect to generate the following code:

```c#
public partial class Song
{
    private Song(string artist, string title, TimeSpan? duration, string genre)
    {
        Artist = artist;
        Title = title;
        Duration = duration;
        Genre = genre;
    }

    public Builder ToBuilder() => new Builder(this);

    public class Builder
    {
        // Public constructor.
        public Builder(string artist, string title)
        {
            Artist = artist;
            Title = title;
        }

        // Copy constructor.
        internal Builder(Song source)
        {
            Artist = source.Artist;
            Title = source.Title;
            Duration = source.Duration;
            Genre = source.Genre;
        }

        public string Artist { get; set; }
        public TimeSpan? Duration { get; set; }
        public string Genre { get; set; } = "General";
        public string Title { get; set; }

        public Song Build()
        {
            var instance = new Song(Artist, Title, Duration, Genre)!;
            return instance;
        }
    }
}
```

By the end of this article, we will be able to generate this code automatically on-the-fly during the build.

Here are some use cases for this code:

```csharp
// Use case 1. Create from scratch.
var songBuilder = new Song.Builder( "Joseph Kabasele", "Indépendance Cha Cha" );
songBuilder.Genre = "Congolese rumba";
var song = songBuilder.Build();

// Use case 2. Create builder from existing object.
var songBuilder2 = song.ToBuilder();
songBuilder2.Duration = new TimeSpan(0, 3, 5);
var song2 = songBuilder.Build();
```

### Implementation steps

Our `[GenerateBuilder]` aspect will need to perform the following steps:

- Introduce a nested class named `Builder` with the following members:
    - A _copy constructor_ initializing the `Builder` class from an instance of the source class.
    - A _public constructor_ for users of our class, accepting values for all required properties.
    - A writable property for each property of the source type.
    - A `Build` method that instantiates the source type with the values set in the `Builder`, calling the `Validate` method if present.
- Add the following members to the source type:
    - A private constructor called by the `Builder.Build` method.
    - A `ToBuilder` method returning a new `Builder` initialized with the current instance.

## Implementing the Builder pattern

In this article, I will only outline the major steps of the implementation. For a detailed implementation, see the [Builder pattern example](https://doc.metalama.net/examples/builder) in the reference documentation.

### Step 1. Create a Metalama aspect

The first step is to add the `Metalama.Framework` package to your project:

```xml
<ItemGroup>
    <PackageReference Include="Metalama.Framework"/>
</ItemGroup>
```

Then, create an aspect class:

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="ClassHeader" %}

The `TypeAspect` class is an abstract base class for aspects that can be applied to types.

### Step 2. Define some infrastructure

Before adding anything to the aspect, we need a data structure to store references to the declarations we generate. The `PropertyMapping` type maps a property of the source code to its corresponding property in the `Builder` type and in constructor parameters.

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.PropertyMapping.cs" syntax="csharp" snippet="Tags" %}

Note that we added the `[CompileTime]` attribute to these classes because they need to be accessible at _compile time_ by the aspect.

{% include get-source-code.html %}

### Step 3. Identify the properties to be mapped

We can now start implementing the aspect. Its entry point is the `BuildAspect` method. The first thing we do is create a list of properties.

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="InitializeMapping" %}

### Step 4. Introduce the Builder type and its properties

Let's create a nested type using the `IntroduceClass` method:

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="IntroduceBuilder" %}

Now we can add properties to our new `Builder` type:

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="IntroduceProperties" %}

### Step 5. Creating the Builder public constructor

Our next task is to create the public constructor of the `Builder` nested type, which should have parameters for all required properties. Let's add this code to the `BuildAspect` method:

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="IntroducePublicConstructor" %}

Here is `BuilderConstructorTemplate`, the template for this constructor. You can see how we use the `Tags` and `PropertyMapping` objects. This code iterates through required properties and assigns a property of the `Builder` type to the value of the corresponding constructor parameter.

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="BuilderConstructorTemplate" %}

### Step 6. Adding a constructor to the source type

Before we implement the `Build` method, we must implement the constructor in the source type. This code snippet from the `BuildAspect` method creates the constructor and its parameters:

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="IntroduceSourceConstructor" %}

The template for this constructor is `SourceConstructorTemplate`. It simply assigns properties based on constructor parameters.

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="SourceConstructorTemplate" %}

### Step 7. Implementing the Build method

The `Build` method of the `Builder` type is responsible for creating an instance of the source (immutable) type from the values of the `Builder`.

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="IntroduceBuildMethod" %}

The T# template for the `Build` method first invokes the newly introduced constructor, then tries to find and call the optional `Validate` method before returning the new instance of the source type.

{% include_file "{{page.source_url}}/GenerateBuilderAttribute.cs" syntax="csharp" snippet="BuildMethodTemplate" %}

### Next implementation steps

I hope the previous steps gave you an idea of how Metalama works. Automating the implementation of the Builder pattern requires a few more steps, all covered in the [Builder pattern example](https://doc.metalama.net/examples/builder):

* Generating the `ToBuilder` method
* Coping with base and derived types
* Handling collection types

## Is it worth it?

As you can see, even with Metalama, automating the Builder pattern is not completely trivial. So, is it worth it?

It depends on how often the aspect will be used in your application. Typically, if an aspect is used fewer than a dozen times, automation may not be worthwhile. However, if you're planning a large project with dozens or even hundreds of classes that would benefit from the builder pattern, then automating it is definitely worth the effort.

Remember, every project will have slightly different requirements for implementing the Builder pattern. To save time, start with the [Builder pattern example](https://doc.metalama.net/examples/builder), understand its principles, and customize it to your needs.

The benefit of automating the pattern implementation as an aspect is that when you want to change the pattern, you only have to edit a _single_ class: the aspect.

## Wrapping up

The Builder pattern has become one of the most important patterns in modern .NET, thanks to its focus on immutability. With the Builder pattern, you get the convenience of mutability during the configuration stage of a component, coupled with the safety and simplicity of immutability after the component has been built.

Implementing the Builder pattern traditionally involves a lot of boilerplate code. Fortunately, tools like Metalama make it easier to automate its implementation.
