const fs = require('fs');
const path = require('path');

// 1. CONFIGURATION
const ALLOWED_EXTENSIONS = ['.html', '.htm', '.pdf', '.png', '.jpg', '.jpeg'];
// ADD YOUR FOLDER NAME TO THIS ARRAY
const BYPASS_FOLDERS = ['Live-Stream-Web-Plugins-master', 'node_modules', '.git', 'private_assets']; 



function buildTree(dir, isRoot = false) {
    const folderName = path.basename(dir);
    if (BYPASS_FOLDERS.includes(folderName)) return null;

    const items = fs.readdirSync(dir);
    const branch = {
        name: folderName || 'Root',
        path: path.relative(__dirname, dir).replace(/\\/g, '/') || '.',
        isRoot: isRoot,
        files: [],
        children: []
    };

    const validItems = items.filter(item => {
        if (item === 'generate_tree.js') return false;
        if (isRoot && item === 'index.html') return false;
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) return !BYPASS_FOLDERS.includes(item);
        return ALLOWED_EXTENSIONS.includes(path.extname(item).toLowerCase());
    });

    validItems.forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            const childBranch = buildTree(fullPath, false);
            if (childBranch) branch.children.push(childBranch);
        } else {
            branch.files.push(item);
        }
    });

    branch.files.sort((a, b) => {
        if (a.toLowerCase() === 'index.html') return -1;
        if (b.toLowerCase() === 'index.html') return 1;
        return a.localeCompare(b);
    });

    branch.children.sort((a, b) => a.name.localeCompare(b.name));
    return branch;
}

function renderTreeHTML(node) {
    const isCollapsed = node.isRoot ? "" : "collapsed";
    const statusLabel = node.isRoot ? "" : "(closed)";

    let fileListHTML = node.files.map(file => {
        const link = `${node.path}/${file}`;
        const isIndex = file.toLowerCase() === 'index.html';
        return `<li class="file-item ${isIndex ? 'index-highlight' : ''}" data-name="${file.toLowerCase()}">
            📄 <a href="./${link}">${file}</a>
        </li>`;
    }).join('\n');

    let childrenHTML = node.children.map(child => renderTreeHTML(child)).join('\n');

    return `<li class="folder-item" data-name="${node.name.toLowerCase()}">
        <span class="folder-toggle" onclick="toggleFolder(this)">
            <span class="icon">📁</span> <span class="name">${node.name}</span> 
            <span class="status-text" style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">${statusLabel}</span>
        </span>
        <ul class="nested ${isCollapsed}">
            ${fileListHTML}
            ${childrenHTML}
        </ul>
    </li>`;
}

const fullTree = buildTree(__dirname, true);

const rootHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Server Map & Debugger</title>
    <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; background: #f1f5f9; color: #1e293b; }
        .tree-container { background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        ul { list-style-type: none; padding-left: 20px; }
        li { margin: 6px 0; }
        .folder-toggle { cursor: pointer; display: inline-flex; align-items: center; user-select: none; }
        .folder-toggle .name { color: #b45309; font-weight: 600; }
        .nested { border-left: 1px solid #cbd5e1; margin-left: 10px; padding-left: 15px; }
        .collapsed { display: none; }
        .index-highlight a { color: #059669; font-weight: bold; border-bottom: 1px solid #059669; }
        a { color: #3b82f6; text-decoration: none; }
        .file-item { color: #64748b; font-size: 0.95rem; }
        
        /* Search UI */
        .controls { margin-bottom: 20px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .search-wrapper { position: relative; }
        #searchBar { padding: 10px 15px; border-radius: 6px; border: 1px solid #cbd5e1; width: 300px; font-size: 14px; outline: none; }
        #matchCount { font-size: 0.85rem; color: #64748b; font-weight: 500; min-width: 100px; }
        button { padding: 8px 16px; cursor: pointer; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; color: #475569; font-weight: 500; }
        .hidden { display: none !important; }
    </style>
</head>
<body>
    <h1>Project Architecture Explorer</h1>
    <div class="controls">
        <div class="search-wrapper">
            <input type="text" id="searchBar" placeholder="Search files or folders..." onkeyup="filterTree()">
        </div>
        <span id="matchCount"></span>
        <button onclick="expandAll()">Expand All</button>
        <button onclick="collapseAll()">Collapse All</button>
    </div>
    <div class="tree-container">
        <ul id="mainTree">${renderTreeHTML(fullTree)}</ul>
    </div>

    <script>
        function toggleFolder(element) {
            const nestedList = element.parentElement.querySelector(".nested");
            const statusText = element.querySelector(".status-text");
            const isNowCollapsed = nestedList.classList.toggle("collapsed");
            statusText.innerText = isNowCollapsed ? "(closed)" : "";
        }

        function filterTree() {
            const query = document.getElementById('searchBar').value.toLowerCase();
            const fileItems = document.querySelectorAll('.file-item');
            const folderItems = document.querySelectorAll('.folder-item');
            const matchCountEl = document.getElementById('matchCount');

            if (query === "") {
                fileItems.forEach(el => el.classList.remove('hidden'));
                folderItems.forEach(el => el.classList.remove('hidden'));
                matchCountEl.innerText = "";
                collapseAll();
                const rootNested = document.querySelector('#mainTree > .folder-item > .nested');
                const rootStatus = document.querySelector('#mainTree > .folder-item .status-text');
                rootNested.classList.remove('collapsed');
                rootStatus.innerText = '';
                return;
            }

            let matches = 0;

            // First, hide everything
            fileItems.forEach(el => el.classList.add('hidden'));
            folderItems.forEach(el => el.classList.add('hidden'));

            // Show matching files and their parent folders
            fileItems.forEach(file => {
                if (file.getAttribute('data-name').includes(query)) {
                    file.classList.remove('hidden');
                    matches++;
                    
                    let parent = file.parentElement.closest('.folder-item');
                    while (parent) {
                        parent.classList.remove('hidden');
                        parent.querySelector('.nested').classList.remove('collapsed');
                        parent.querySelector('.status-text').innerText = '';
                        parent = parent.parentElement.closest('.folder-item');
                    }
                }
            });

            // Show matching folders and their parent folders
            folderItems.forEach(folder => {
                if (folder.getAttribute('data-name').includes(query)) {
                    folder.classList.remove('hidden');
                    matches++;
                    
                    let parent = folder.parentElement.closest('.folder-item');
                    while (parent) {
                        parent.classList.remove('hidden');
                        parent.querySelector('.nested').classList.remove('collapsed');
                        parent.querySelector('.status-text').innerText = '';
                        parent = parent.parentElement.closest('.folder-item');
                    }
                }
            });

            matchCountEl.innerText = matches + " match(es) found";
        }

        function expandAll() {
            document.querySelectorAll('.nested').forEach(el => el.classList.remove('collapsed'));
            document.querySelectorAll('.status-text').forEach(el => el.innerText = '');
        }

        function collapseAll() {
            document.querySelectorAll('.nested').forEach(el => el.classList.add('collapsed'));
            document.querySelectorAll('.status-text').forEach(el => el.innerText = '(closed)');
        }
    </script>
</body>
</html>`;

fs.writeFileSync('index.html', rootHTML);
console.log('✅ Final version built: Search with Match Count and Root-Only Exclusion.');