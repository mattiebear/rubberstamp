# Rubberstamp

_Seamlessly generate template files with dynamic data._

[![CI](https://github.com/mattiebear/rubberstamp/actions/workflows/ci.yml/badge.svg)](https://github.com/mattiebear/rubberstamp/actions/workflows/ci.yml)

---

## What is Rubberstamp?

Rubberstamp provides a simple way to copy template directories while modifying file names and contents.

#### Features

- Simple, intuitive API
- Template-based case modification of variables

## Installation

```sh
npm i rubberstamp
```

## Usage

First, create template files in your source directory:

```js
// templates/__name__.js.template

export const __name__ = () => {
	return console.log('Hello! My name is __name__');
};
```

```json
// templates/package.json.template

{
	"name": "component-__name__",
	"main": "__name__.js"
}
```

Then, use the `stamp()` function to clone the templated directory and populate the files with the provided variables.

```ts
import { stamp } from 'rubberstamp';

const name = 'hello';

const source = '/templates';
const destination = `/packages`;

const inject = { name };

const copyTemplate = async () => {
	await stamp(source, destination, { inject });
};
```

This will create modifed fields in the specified directory:

```js
// packages/hello.js

export const hello = () => {
	return console.log('Hola! My name is hello');
};
```

```json
// packages/package.json

{
	"name": "component-hello",
	"main": "hello.js"
}
```

Super simple!

## `stamp()` Configuration

`stamp()` accepts a single configuration object.

| name          | required | description                                                                                                   |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `source`      | yes      | The file path location of your template files. `stamp` will recursively transfer all files in this directory. |
| `destination` | yes      | The location to which all files from `source` will be transferred while maintaining directory structure.      |
| `inject`      | no       | An object of key value pairs denoting the variables to inject into file/directory names and content.          |

## Variable Injection

You can alter the names of files and directories as well as the contents when injection tokens are included in either. To modify the name of a file or directory, include the format `__name__` in the filename. Rubberstamp will replace instances of `__name__` with the provided `{ name: 'value' }` entry provided in the injection object.

## File Names

Note that you do not need to append `.template` to the end of file names but it is recommended so IDEs do not treat the files as syntactically invalid. Any `.template` suffix will be automatically removed from file names but are not required.

## Case Transformations

When a file is populated with variable data it's often necessary to change the case of the passed string variables. One way to do this is to declare multiple variables and pass them in the `inject` option:

```ts
const inject = {
	name: 'hello world',
	nameCapital: 'Hello World',
	namePascal: 'HelloWorld',
	nameCamel: 'helloWorld',
};
```

This can be especially tedious with a large number of variables. Instead, Rubberstamp allows for case modifications within injection tokens. Simply include `$` and the case modifier after the token name.

```ts
// templates/__name$K__.tsx.template

import { React } from 'react';

export const __name$P__ = () => { // convert to PascalCase
	return <div>I am __name$C__<div> // convert to Capital Case
}
```

Assuming the provided injections `{ name: 'my component' }` the file would be modified to the following:

```ts
// packages/my-component.tsx

import { React } from 'react';

export const MyComponent = () => {
	return <div>I am My Component<div>
}
```

Valid case modifiers are

| case    | token | example     |
| ------- | ----- | ----------- |
| camel   | M     | helloWorld  |
| capital | C     | Hello World |
| kebab   | K     | hello-world |
| pascal  | P     | HelloWorld  |
| snake   | S     | hello_world |

Note that both lower and upper case tokens are value, i.e. `__name$m__` and `__name$M__` are identical.

## Upcoming Features

- Optimized directory and file creation
- Synchornous `stamp()` call
- Callback functions
- Custom transformations
