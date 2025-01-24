import React from 'react'

interface QuestionProps {
  title: string;
  difficulty: string;
  description: string[];
  constraints: string[];
  examples: {
    id: number;
    input: string;
    output: string;
    explanation?: string;
  }[];
}

const Question: React.FC<QuestionProps> = ({
  title,
  difficulty,
  description,
  constraints,
  examples
}) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold mb-2">
          {title} <span className="text-gray-400">({difficulty})</span>
        </h1>
        {description.map((paragraph, index) => (
          <p key={index} className="text-gray-300">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        {constraints.map((constraint, index) => (
          <p key={index} className="text-gray-300">
            {constraint}
          </p>
        ))}
      </div>

      <div className="space-y-4">
        {examples.map((example) => (
          <div key={example.id}>
            <h3 className="font-medium mb-2">Example {example.id}:</h3>
            <div className="space-y-1">
              <p className="text-gray-400">Input: {example.input}</p>
              <p className="text-gray-400">Output: {example.output}</p>
              {example.explanation && (
                <p className="text-gray-400">
                  Explanation: {example.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
