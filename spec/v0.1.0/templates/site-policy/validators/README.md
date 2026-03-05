## Site policy validators

This folder contains language-specific helpers for validating site-level AOM policy documents against the canonical schema in `spec/v0.1.0/site-policy-schema.json`.

- **Python**: `python_validator.py`
- **Node**: `node_validator.js`

### Usage

From the repository root:

```bash
# Python
python spec/v0.1.0/templates/site-policy/validators/python_validator.py .well-known/aom-policy.open.site.json

# Node
node spec/v0.1.0/templates/site-policy/validators/node_validator.js .well-known/aom-policy.open.site.json
```

Both scripts:

- Load `spec/v0.1.0/site-policy-schema.json`
- Validate the provided JSON file
- Print `[OK]` on success or a list of validation errors on failure (non-zero exit code)

