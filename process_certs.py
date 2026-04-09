import os
import fitz
import json
import shutil
import re

cert_dir = "d:/Portfolio-1/frontend/src/assets/certificates"
preview_dir = os.path.join(cert_dir, "previews")
if not os.path.exists(preview_dir):
    os.makedirs(preview_dir)

results = []

def extract_metadata(text, filename):
    text_lower = text.lower()
    
    org = "Unknown Org"
    if "coursera" in text_lower: org = "Coursera"
    elif "sebi" in text_lower: org = "SEBI"
    elif "nestle" in text_lower: org = "Nestle"
    elif "ibm" in text_lower: org = "IBM"
    elif "hack2skill" in text_lower: org = "Hack2Skill"
    elif "unstop" in text_lower: org = "Unstop"
    
    # Try finding something that looks like a title
    lines = [l.strip() for l in text.split('\n') if len(l.strip()) > 5]
    title = filename.split('.')[0] # default to filename
    
    if len(lines) > 2:
        title_candidates = [l for l in lines if l.istitle() or len(l) > 10]
        if title_candidates:
            # Just take the filename for simplicity, we will manually fix them up using the text output
            pass
            
    return {"filename": filename, "org": org, "text_preview": text[:200].replace('\n', ' ')}

for f in os.listdir(cert_dir):
    path = os.path.join(cert_dir, f)
    if not os.path.isfile(path): continue
    
    ext = f.split('.')[-1].lower()
    if ext == 'pdf':
        try:
            doc = fitz.open(path)
            page = doc[0]
            pix = page.get_pixmap(dpi=150)
            preview_filename = f"{f}.jpg"
            preview_path = os.path.join(preview_dir, preview_filename)
            pix.save(preview_path)
            
            text = page.get_text()
            meta = extract_metadata(text, f)
            meta["preview"] = preview_filename
            results.append(meta)
            doc.close()
        except Exception as e:
            results.append({"filename": f, "error": str(e)})
            
    elif ext in ['png', 'jpg', 'jpeg']:
        try:
            preview_filename = f
            preview_path = os.path.join(preview_dir, preview_filename)
            shutil.copy2(path, preview_path)
            
            # Since no text, use filename
            org = "Unknown Org"
            fn_lower = f.lower()
            if "coursera" in fn_lower: org = "Coursera"
            elif "sebi" in fn_lower: org = "SEBI"
            elif "nestle" in fn_lower: org = "Nestle"
            elif "ibm" in fn_lower: org = "IBM"
            elif "hack2skill" in fn_lower: org = "Hack2Skill"
            elif "unstop" in fn_lower: org = "Unstop"
            
            results.append({
                "filename": f,
                "org": org,
                "text_preview": "Image file",
                "preview": preview_filename
            })
        except Exception as e:
            results.append({"filename": f, "error": str(e)})

print(json.dumps(results, indent=2))
