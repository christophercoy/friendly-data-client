import { useState } from 'react';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<object[] | null>(null);

  const handleAsk = async () => {
    try {
      const result = await axios.post<object[]>('http://coycafe.ddns.net:3000/ask', {
        question: question,
      });
      setResponse(result.data);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const renderTableHeaders = (data: object) => {
    return Object.keys(data).map((key) => (
      <th align="left" key={key} className="border-b border-gray-400 p-2 text-left capitalize">
        { key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() }
      </th>
    ));
  };

  const renderTableRow = (item: object) => {
    return Object.entries(item).map(([key, value]) => (
      <td key={key} className="border-b border-gray-400 p-2 text-left">
        {key.includes('date') || key.includes('time')
          ? new Date(value as string).toLocaleString()
          : value.toString()}
      </td>
    ));
  };

  return (
    <div className="min-h-screen bg-white text-blue-700 p-6">
      <h1 className="text-3xl font-semibold mb-4">Quick Patient Information</h1>

      <div className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question here..."
          className="w-full h-24 p-2 border border-blue-300 rounded"
        />
      </div>

      <button
        onClick={handleAsk}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Ask
      </button>

      <div className="mt-6">
        {response && response.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>{renderTableHeaders(response[0])}</tr>
            </thead>
            <tbody>
              {response.map((item, index) => (
                <tr key={index}>{renderTableRow(item)}</tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
}

export default App;