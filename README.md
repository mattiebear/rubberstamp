# Rubberstamp

_Seamlessly generate template files with dynamic data._

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
// templates/utils/__name__.js.template

export const <name> = () => {
	return console.log('Hello! My name is ' + '<name>');
}
```

```json
// templates/component/package.json.template

{
	"name": "component-<name>",
	"main": "<name>.js"
}
```

Then, use the `stamp()` function to clone the templated directory and populate the files with the provided variables.

```ts
import { stamp } from 'rubberstamp';

const name = 'hello';

const source = '/templates/utils';
const destination = `/my-utils/${name}`;

const inject = { name };

const copyTemplate = async () => {
	await stamp(source, destination, { inject });
};
```

This will create modifed fields in the specified directory:

```js
// my-utils/hello.js

export const hello = () => {
	return console.log('Hola! My name is ' + 'hello');
};
```

```json
// my-utils/package.json

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

Within files you can use `__name__` or the similar `<name>` syntax to denote injection points.

## Case Modification

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
// templates/components/__name$K__.tsx.template

import { React } from 'react';

export const <name$P> = () => {
	return <div>I am <name$T><div>
}
```

Assuming the provided injections `{ name: 'my component' }` the file would be modified to the following:

```ts
// my-files/components/my-component.tsx

import { React } from 'react';

export const MyComponent = () => {
	return <div>I am My Component<div>
}
```

Valid case modifiers are

| case    | token | example     |
| ------- | ----- | ----------- |
| camel   | m     | helloWorld  |
| capital | c     | Hello World |
| kebab   | k     | hello-world |
| pascal  | p     | HelloWorld  |
| snake   | s     | hello_world |

Note that both lower and upper case tokens are value, i.e. `__name$m__` and `__name$M__` are identical.

## Upcoming Features

- Callback functions
- Custom transformations
