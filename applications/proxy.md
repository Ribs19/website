---
title: "Proxy Pattern"
summary: "The Proxy pattern in C# provides substitutes for objects to add behavior and can be implemented via interfaces. Use Metalama to generate static proxies instead of dynamic ones."
keywords: "Proxy pattern, boilerplate code, dynamic proxies, static proxies, Metalama, C#, interceptors, Roslyn source generators, compile time"
---

The Proxy pattern is a structural design pattern that lets you provide a substitute or placeholder for another object, typically to add new behavior. In C#, the proxied object is generally represented by an interface, although it's also possible to implement the pattern with virtual methods.

Implementing the Proxy pattern involves duplicating all interface members, which requires a lot of boilerplate code. The proxy's added behavior can either be implemented separately in each of these members or can be abstracted. In this case, the abstraction is called an _interceptor_.

There are three ways to generate proxy classes:

* By hand, which is feasible only with a small number of interfaces and members.
* Dynamically at runtime using libraries like [Castle DynamicProxy](https://github.com/castleproject/Core/blob/master/docs/dynamicproxy.md), which increases startup time and is not compatible with ahead-of-time compilation.
* Statically at build time using Roslyn source generators or Metalama.

## Example

Let's see how a proxy aspect could work in practice. This example is a slightly simplified version of [this sample aspect](https://github.com/metalama/Metalama.Samples/tree/HEAD/examples/Metalama.Samples.Proxy).

Suppose we have an implementation class `OrderService` that we cannot modify, but we want to add logging to it.

The `OrderService` implements the following interface:

```csharp
public interface IOrderService
{
   OrderId PlaceOrder(Order order);
   void CancelOrder(OrderId orderId);
}
```

We generate a static proxy using the following code:

```csharp
public class Fabric : ProjectFabric
{
    public override void AmendProject(IProjectAmender amender)
    {
        amender.SelectReflectionType(typeof(IOrderService)).GenerateStaticProxy();
    }
}
```

We can now use the proxy class as follows:

```csharp
var orderServiceProxy = new OrderServiceProxy(
    new OrderService(),
    new LoggingInterceptor());

orderServiceProxy.PlaceOrder(order);
```

{: .show-more }
Show me how it works!

Metalama generates the following code:

```csharp
public class OrderServiceProxy : IOrderService
{
    private IOrderService _intercepted;
    private IInterceptor _interceptor;

    public SomeProxy(IInterceptor interceptor, IOrderService intercepted)
    {
        _interceptor = interceptor;
        _intercepted = intercepted;
    }

    public OrderId PlaceOrder(Order order)
    {
        var args = Tuple.Create(order);
        return _interceptor.Invoke(ref args, Invoke, nameof(PlaceOrder));

        int Invoke(ref Tuple<Order> receivedArgs)
        {
            return _intercepted.PlaceOrder(receivedArgs.Item1);
        }
    }

    public void CancelOrder(OrderId orderId)
    {
        var args = Tuple.Create(orderId);
        _interceptor.Invoke(ref args, Invoke, nameof(CancelOrder));
        return;

        void Invoke(ref Tuple<Order> receivedArgs)
        {
            _intercepted.CancelOrder(receivedArgs.Item1, receivedArgs.Item2);
            return default;
        }
    }
}
```

An interceptor is a class implementing the following interface:

```csharp
public interface IInterceptor
{
    public TResult Invoke<TArgs, TResult>(
        ref TArgs args,
        InterceptorDelegate<TArgs, TResult> proceed,
        string methodName) where TArgs : struct, ITuple;
}
```

For logging, we might use this code:

```csharp
public interface LoggingInterceptor : IInterceptor
{
    public TResult Invoke<TArgs, TResult>(
        ref TArgs args,
        InterceptorDelegate<TArgs, TResult> proceed,
        string methodName) where TArgs : struct, ITuple
    {
        Console.WriteLine(
          $"Executing {methodName}({string.Join(", ", args.ToArray())})");
        return proceed(ref args);
    }
}
```

## Metalama benefits

* **Fast application startup.** Static proxies are generated at compile time instead of at runtime, so your application starts faster.
* **Compatible with AoT compilation.** No reflection is necessary at runtime.
* **No boilerplate code.** Unlike with the handwritten approach, you just have to write a single line of code.

## Resources

* Source code: [Metalama.Samples.Proxy](https://github.com/metalama/Metalama.Samples/tree/HEAD/examples/Metalama.Samples.Proxy)
