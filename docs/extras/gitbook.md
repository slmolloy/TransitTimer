#GitBook
If you've browed projects on github, you've probably seen a few README.md
files. Writing them can tricky without a nice tool to render the file. I use
WebStorm which can render the md file as I type, which is cool, but how do I
share it.

GitBook.

Thats what this whole site was built in.

##Install and Setup
They have good documentation:
[http://toolchain.gitbook.com/setup.html](http://toolchain.gitbook.com/setup.html)

Summary if you already have node:
```bash
npm install gitbook-cli -g
gitbook serve
```
To use GitBook you'll need a SUMMARY.md in addition to the famous README.md.
The summary file acts as the table of contents for your book. The
```gitbook serve``` command will update the server and refresh the browser
every time you save changes to your documentation. Nice!

#GitBook Editor
Grrr... I tried using this tool and lost half an hour of work.

GitBook Editor is built by the same guys building the CLI tool. Its a GUI for
editing GitBook projects. The main issue, this tool does whatever it wants with
the git repository it uses. If your GitBook sits in the same repository as your
source code then GitBook will happily ```git reset``` and ```git checkout```
to remove your unsaved work then ```git commit``` every time it saves files. It
gives no warning that it is removing your changes. I was more careful with it
after I lost my changes, I wanted to give it a fair shot. It kept conflicting
with my work so I gave up on it. It is useful as a learning tool for md syntax
thought. If documentation was worked on in a separate location from the code
repository then it could be nice tool.