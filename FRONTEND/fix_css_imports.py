#!/usr/bin/env python3
import os
import re

def calculate_relative_path(file_path):
    """Calculate the correct relative path to components/styles based on file location"""
    # Count directory depth from src/
    parts = file_path.split('/')
    if 'src' in parts:
        src_index = parts.index('src')
        depth = len(parts) - src_index - 2  # -2 for src itself and the filename
        return '../' * depth + 'components/styles/'
    return None

def fix_css_imports(directory):
    """Fix all CSS imports in JavaScript files"""
    fixed_count = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.js') or file.endswith('.jsx'):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # Calculate correct relative path for this file
                    rel_path = calculate_relative_path(file_path)
                    if not rel_path:
                        continue
                    
                    # Replace @/components/styles/ with correct relative path
                    content = re.sub(
                        r"from ['\"]@/components/styles/",
                        f"from '{rel_path}",
                        content
                    )
                    
                    # Replace import statements with @ alias
                    content = re.sub(
                        r"import ['\"]@/components/styles/",
                        f"import '{rel_path}",
                        content
                    )
                    
                    # Replace ./styles/ patterns
                    content = re.sub(
                        r"from ['\"]\.\/styles/",
                        f"from '{rel_path}",
                        content
                    )
                    
                    content = re.sub(
                        r"import ['\"]\.\/styles/",
                        f"import '{rel_path}",
                        content
                    )
                    
                    # Replace ../styles/ patterns
                    content = re.sub(
                        r"from ['\"]\.\.\/styles/",
                        f"from '{rel_path}",
                        content
                    )
                    
                    content = re.sub(
                        r"import ['\"]\.\.\/styles/",
                        f"import '{rel_path}",
                        content
                    )
                    
                    # Replace ../../styles/ patterns
                    content = re.sub(
                        r"from ['\"]\.\.\/\.\.\/styles/",
                        f"from '{rel_path}",
                        content
                    )
                    
                    content = re.sub(
                        r"import ['\"]\.\.\/\.\.\/styles/",
                        f"import '{rel_path}",
                        content
                    )
                    
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Fixed: {file_path}")
                        fixed_count += 1
                        
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    
    return fixed_count

if __name__ == "__main__":
    print("Fixing all CSS imports...")
    count = fix_css_imports('src')
    print(f"\nFixed {count} files")
    print("Running build...")
    os.system('npm run build')
