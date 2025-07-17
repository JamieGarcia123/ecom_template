import {useState} from "react";

const items = [
  { title: "Jeans", text: "Browse our products" },
  { title: "Short", text: "Browse our products" },
  { title: "T-shirts", text: "Browse our products" },
  { title: "Sweatshirts", text: "Browse our products" },
  { title: "Jackets", text: "Browse our products" },
  { title: "Accessories", text: "Browse our products" },
  { title: "Shoes", text: "Browse our products" },
];

  


export function Landing() {
  const [itemFound, setItemFound] = useState("");
function findItemByTitle(title: string) {
    items.find(item => item.title === title)
    setItemFound(title);
  } 
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
          
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <section className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <label className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              Search<input
                type="text"
                className="w-full mt-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Search for products..."
                onChange={(e) => {findItemByTitle(e.target.value);
                }}
              />
              </label>
      
          { !itemFound ? 
            <ul>
              {items.map(({ title, text }) => (
                <li key={title}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-gray-500">{text}</p>
                </li>
              ))}
            </ul> 
          : <p>{itemFound}</p>
          }   
          </section>
        </div>
      </div>
    </main>
  );
}


