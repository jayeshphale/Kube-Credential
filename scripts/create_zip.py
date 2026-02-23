import os, zipfile
root=r'D:\kube-credential'
out=os.path.join(root,'kube-credential-submission.zip')
excludes_dirs = {'.git','node_modules','.vscode','.vs'}
if os.path.exists(out): os.remove(out)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(root):
        relpath = os.path.relpath(dirpath, root)
        parts = relpath.split(os.sep) if relpath!='.' else []
        if any(p in excludes_dirs for p in parts):
            continue
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if any(p in fp.replace('\\','/') for p in ['/node_modules/', '/.git/', '/.vscode/', '/.vs/']):
                continue
            arcname = os.path.join(relpath, f) if relpath!='.' else f
            try:
                z.write(fp, arcname)
            except Exception as e:
                print('skip', fp, e)
print('Wrote', out, 'size', os.path.getsize(out) if os.path.exists(out) else 'missing')
