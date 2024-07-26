# Welcome to ZSet Lang

ZSet Lang stands for Z Set which refers to the Integer Set. This is a math expression processor language
oriented to resolve systems of congruence equation with only one unknown variable.

Let's see an example.
$$
a.  \left\{ \\
    \begin{aligned}
    x+1 \equiv 12 \ (17) \\
    8x \equiv 37 \ (101)
    \end{aligned}
\right.
$$

The system $a$ has $x$ which is value has to solve both equations.

In ZSet the same system can be represent like this.
```
a = {[ 
  x:
  x+1 cong 12 (17),
  8*x cong 37 (101)
]}
```

In order to solve the system, a lot of steps have to be done. But, ZSet has an operation for do that.

```
s = res a
```

The `res` *(short for "resolve")* operator accepts a system of congruence, then resolve it. The result is stored at `s` which is a set of congruence classes.

```
x = rem s[0]
```
Once obtained the congruence class that solve the system. The value of $x$ has to be assigned to the 
remainder of the congruence class. 
The `rem` *(short for "remainder")* operator extracts the remainder of a congruence class. While `s[0]` takes the first element of the set which is the congruence class itself.

```
@print(forall c in a: c equal true)
```
Now, with $x$ assigned to a value, each congruence of the system can be revaluated to prove the result obtained is correct. 
The `forall` operator takes a the system and iterates it, taking each individual congruence equation called $c$. Then, checks if $c$ is true.

In formal math, can be represent like this.
$$
a.  \left\{ \\
    \begin{aligned}
    x+1 \equiv 12 \ (17) \\
    8x \equiv 37 \ (101)
    \end{aligned}
\right.
$$
$$
x = 1717k+1507, k \in \Z \Rightarrow x \equiv 1507 \ (1717)
$$
$$
``\text{the system } a \text{ is solved}" \Leftrightarrow
\forall c \in a: c \leftrightarrow T
$$

*Run this example on the [Playground](agustin-del-pino.github.io/playground.html?run=YSA9IHtbIHg6CiDEhisxIGNvbmcgMTIgKDE3KSzEiSA4KnjEjsSQxJIzN8SWMTAxKQpdfQpzxIEgcmXEr2EKxKDEgsSybSBzWzBdCkBwcmludCjEvMS+LMSGxYpmb3JhbGzEjiDFhCBhOsWTZXF1xZAgdHJ1ZSk=).*