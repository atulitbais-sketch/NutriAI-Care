import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)

prompt = PromptTemplate(
    input_variables=["labs"],
    template="""
You are a medical lab interpretation assistant.
Do NOT diagnose.
Explain results in simple words.

Lab values:
{labs}

Give output in this format:
- Status (Normal/Low/High)
- Explanation (simple)
- Health note (non-alarming)
"""
)

def interpret_labs(labs: dict) -> str:
    """
    labs example:
    {
        "Hemoglobin": "11 g/dL",
        "WBC": "12000 /µL"
    }
    """
    formatted_labs = ", ".join([f"{k}: {v}" for k, v in labs.items()])
    response = llm.invoke(prompt.format(labs=formatted_labs))
    return response.content
