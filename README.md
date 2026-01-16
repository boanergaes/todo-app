# Tusketeer Todo App
Tusketeer is a light weight todo app with the following features:
    - Todos (tasks) structured under Projects
    - Add, Edit and Delete Projects
    - Add, Edit and Delete Sticky Notes for every project
    - Add, Edit and Delete tasks under projects
    - Tasks have Due dates and color coded priority
    - Add and Delete Sub tasks under each task
    - Each project, task or subtask has it's own unique id and id tracker (and generator) system.
    - A decent UI
    - and more coming

## Project Structure

project-root/
│
├── node_modules/               # Installed packages (ignored in git)
|
├── dist/                       # Webpack build output (ignored in git)
|   ├──images/                  
│   ├── index.html              
│   ├── bundle[contenthash].js              
│   └── styles.css            
│
├── src/                        # Source code
│   ├── assets/                 # icons and images
│   │
│   ├── scripts/                # JavaScript code
│   │   ├── dom.js              
│   │   ├── storage.js
│   │   |── utils.js
│   │   └── index.js            # Main entry point for webpack
│   │
│   ├── styles/
│   │   └── workspace.css       # stylesheet
│   │
│   └── index.html              # Source HTML (template for HtmlWebpackPlugin)
│
├── .gitignore
├── package.json
├── package-lock.json
├── webpack.config.js
└── README.md
    

## Tech Stack
- Vanila HTML, CSS, JavaScript
- Webpack for bundling
- date-fns for date formatting

## LocalStorage and SessionStorage

### LocalStorage:
All projects are stored in the Browser's LocalStorage (don't use this web app for sensitive info).
Theme, available valid Project, Task, and Sub task IDs are stored and tracked in LocalStorage.

### SessionStorage:
Currently rendered Project's ID is stored and tracked in SessionStorage.

## Attributions

- <a href='https://www.pinterest.com/' target='_blank'>pinterest</a>: for background image
- <a href='https://lucide.dev/' target='_blank'>Lucid.dev</a>: for icons


- This Todo App project was done as part of a front-end bootcamp provided by <a href='https://nexustutorial.vercel.app/'>Nexus Tutorials</a>. 