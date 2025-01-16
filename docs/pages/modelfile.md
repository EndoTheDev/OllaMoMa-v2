# Modelfile Configuration

The Modelfile page allows you to view and understand the configuration files that define your Ollama models. Here you can learn about modelfile syntax and how to customize your models.

## Features

### Modelfile Overview
- View modelfile contents for each model
- Understand model configuration parameters
- Learn about model customization options
- See base model relationships

### Configuration Options
1. **FROM Command**
   - Specifies the base model
   - Example: `FROM llama3.2:3b`
   - Sets the foundation for your model

2. **System Prompts**
   - Define default behavior
   - Set personality and context
   - Configure response style

3. **Parameters**
   - Temperature settings
   - Context window size
   - Other model-specific options

### Common Settings
1. **Model Parameters**
   - Temperature control
   - Top-p and top-k values
   - Repeat penalty settings
   - Context length adjustments

2. **System Messages**
   - Default instructions
   - Behavior guidelines
   - Response formatting

## How to Use

1. **Viewing Modelfiles**
   - Navigate to the Models page
   - Select a model
   - Click the Modelfile tab
   - Review configuration details

2. **Understanding Parameters**
   - Read parameter descriptions
   - See default values
   - Understand impact on model behavior

3. **Learning Syntax**
   - Study example configurations
   - Understand command structure
   - Learn parameter formatting

## Tips
- Review base model documentation
- Start with simple modifications
- Test changes incrementally
- Keep backups of working configurations

## Example Modelfile

```modelfile
FROM llama3.2:3b
PARAMETER temperature 0.7
PARAMETER top_p 0.7
PARAMETER top_k 50
PARAMETER repeat_penalty 1.1
SYSTEM You are a helpful AI assistant...
```

## Troubleshooting

Common issues and solutions:
1. Check syntax formatting
2. Verify parameter values
3. Ensure base model exists
4. Review system prompt formatting
