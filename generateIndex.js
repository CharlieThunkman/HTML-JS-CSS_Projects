const fs = require('fs');
const path = require('path');

const ALLOWED_EXTENSIONS = ['.html', '.htm', '.pdf', '.png', '.jpg', '.jpeg'];
const BYPASS_FOLDERS = ['bypass', 'node_modules', '.git'];

const { execSync } = require('child_process');

function buildTree(dir, isRoot = false) {
    const folderName = path.basename(dir);
    if (BYPASS_FOLDERS.includes(folderName)) return null;

    const items = fs.readdirSync(dir);
    
    // Check for README files
    const readmeFile = items.find(f => f.toLowerCase() === 'readme.md' || f.toLowerCase() === 'readme.txt');
    let readmeData = { content: "", type: "", mtime: null };

    if (readmeFile) {
        const fullPath = path.join(dir, readmeFile);
        readmeData.content = fs.readFileSync(fullPath, 'utf8');
        readmeData.type = path.extname(readmeFile).toLowerCase();
        readmeData.mtime = fs.statSync(fullPath).mtime.toISOString();
    }

    const branch = {
        name: folderName || 'Root',
        path: path.relative(__dirname, dir).replace(/\\/g, '/') || '.',
        isRoot: isRoot,
        readme: readmeData,
        files: [],
        children: []
    };

    const validItems = items.filter(item => {
        if (item === 'generate_tree.js' || item === 'README.md' || item === 'README.txt') return false;
        if (isRoot && item === 'index.html') return false;
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) return !BYPASS_FOLDERS.includes(item);
        return ALLOWED_EXTENSIONS.includes(path.extname(item).toLowerCase());
    });

	validItems.forEach(item => {
		const fullPath = path.join(dir, item);
		const stats = fs.statSync(fullPath);
		
		if (stats.isDirectory()) {
			const childBranch = buildTree(fullPath, false);
			if (childBranch) branch.children.push(childBranch);
		} else {
			// GET THE ACCURATE GIT TIMESTAMP
			let gitTime;
			try {
				// This command asks Git for the timestamp of the last commit involving this file
				gitTime = execSync(`git log -1 --format=%ai -- "${fullPath}"`).toString().trim();
			} catch (e) {
				// Fallback to file system if Git fails (e.g., untracked files)
				gitTime = stats.mtime.toISOString();
			}
	
			branch.files.push({
				name: item,
				mtime: gitTime || stats.mtime.toISOString()
			});
		}
	});

    branch.children.sort((a, b) => a.name.localeCompare(b.name));
    return branch;
}

function renderTreeHTML(node) {
    const isCollapsed = node.isRoot ? "" : "collapsed";
    const statusLabel = node.isRoot ? "" : "(closed)";

    let readmeHTML = "";
    if (node.readme.content) {
        const isMarkdown = node.readme.type === '.md';
        readmeHTML = `
            <div class="readme-box">
                <div class="readme-header">
                    <span>${node.readme.type === '.md' ? 'README.md' : 'README.txt'}</span>
                    <span class="time-ago" data-time="${node.readme.mtime}"></span>
                </div>
                <div class="${isMarkdown ? 'markdown-body' : 'plain-text'}">${node.readme.content}</div>
            </div>`;
    }

    let fileListHTML = node.files.map(file => {
        const link = `${node.path}/${file.name}`;
        const isIndex = file.name.toLowerCase() === 'index.html';
        return `
        <li class="file-item ${isIndex ? 'index-highlight' : ''}" data-name="${file.name.toLowerCase()}">
            <div class="file-row">
                <span>📄 <a href="./${link}">${file.name}</a></span>
                <span class="time-ago" data-time="${file.mtime}"></span>
            </div>
        </li>`;
    }).join('\n');

    let childrenHTML = node.children.map(child => renderTreeHTML(child)).join('\n');

    return `
    <li class="folder-item" data-name="${node.name.toLowerCase()}">
        <span class="folder-toggle" onclick="toggleFolder(this)">
            <span class="icon">📁</span> <span class="name">${node.name}</span> 
            <span class="status-text">${statusLabel}</span>
        </span>
        <ul class="nested ${isCollapsed}">
            ${readmeHTML}
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
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; background: #f1f5f9; color: #1e293b; }
        .tree-container { background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; }
        ul { list-style-type: none; padding-left: 20px; }
        li { margin: 8px 0; }
        .folder-toggle { cursor: pointer; display: inline-flex; align-items: center; user-select: none; }
        .folder-toggle .name { color: #b45309; font-weight: 600; }
        .nested { border-left: 1px solid #cbd5e1; margin-left: 10px; padding-left: 15px; }
        .collapsed { display: none; }
        
        /* File Row Layout */
        .file-row { display: flex; justify-content: space-between; align-items: center; max-width: 800px; }
        .time-ago { font-size: 0.75rem; color: #94a3b8; font-family: monospace; }
        
        .index-highlight a { color: #059669; font-weight: bold; }
        a { color: #3b82f6; text-decoration: none; }
        
        /* README Styling */
        .readme-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin: 10px 0 20px 0; max-width: 800px; }
        .readme-header { display: flex; justify-content: space-between; padding: 8px 12px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 0.75rem; font-weight: bold; color: #64748b; }
        .markdown-body, .plain-text { padding: 15px; font-size: 0.9rem; }
        .plain-text { white-space: pre-wrap; font-family: monospace; }

        .controls { margin-bottom: 20px; display: flex; gap: 10px; align-items: center; }
        #searchBar { padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1; width: 300px; }
        .hidden { display: none !important; }
    </style>
</head>
<body>
    <h1>Project Architecture Explorer</h1>
    <div class="controls">
        <input type="text" id="searchBar" placeholder="Search files..." onkeyup="filterTree()">
        <span id="matchCount" style="font-size: 0.85rem; color: #64748b;"></span>
        <button onclick="expandAll()">Expand All</button>
        <button onclick="collapseAll()">Collapse All</button>
    </div>
    <div class="tree-container">
        <ul id="mainTree">${renderTreeHTML(fullTree)}</ul>
    </div>

    <script>
        // Convert ISO dates to "Time Ago" format
        function formatTimeAgo(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 60) return 'just now';
            if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + 'm ago';
            if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + 'h ago';
            if (diffInSeconds < 2592000) return Math.floor(diffInSeconds / 86400) + 'd ago';
            return date.toLocaleDateString();
        }

        document.addEventListener("DOMContentLoaded", () => {
            // Render Markdown
            document.querySelectorAll('.markdown-body').forEach(box => {
                box.innerHTML = marked.parse(box.innerHTML);
            });
            // Update Timestamps
            document.querySelectorAll('.time-ago').forEach(el => {
                el.innerText = formatTimeAgo(el.getAttribute('data-time'));
            });
        });

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
                return;
            }

            let matches = 0;
            fileItems.forEach(el => el.classList.add('hidden'));
            folderItems.forEach(el => el.classList.add('hidden'));

            fileItems.forEach(file => {
                if (file.getAttribute('data-name').includes(query)) {
                    file.classList.remove('hidden');
                    matches++;
                    let p = file.parentElement.closest('.folder-item');
                    while (p) {
                        p.classList.remove('hidden');
                        p.querySelector('.nested').classList.remove('collapsed');
                        p = p.parentElement.closest('.folder-item');
                    }
                }
            });
            matchCountEl.innerText = matches + " match(es) found";
        }
        
        function expandAll() { document.querySelectorAll('.nested').forEach(el => el.classList.remove('collapsed')); }
        function collapseAll() { document.querySelectorAll('.nested').forEach(el => el.classList.add('collapsed')); }
    </script>
</body>
</html>`;

fs.writeFileSync('index.html', rootHTML);
