import { Select } from "@meetxl/ui";

export const SelectDocs: React.FC = () => {
  return (
    <div className="flex items-start gap-2">
      <Select
        placeholder="Attributes"
        items={[
          {
            label: "Fruits",
            items: [
              { display: "Apple", value: "apple" },
              { display: "Banana", value: "banana" },
              { display: "Blueberry", value: "blueberry" },
            ],
          },
          {
            label: "Vegetables",
            items: [
              { display: "Broccoli", value: "broccoli" },
              { display: "Cabbage", value: "cabbage" },
              { display: "Carrot", value: "carrot" },
            ],
          },
          {
            label: "Meat",
            items: [
              { display: "Beef", value: "beef" },
              { display: "Chicken", value: "chicken" },
              { display: "Lamb", value: "lamb" },
            ],
          },
        ]}
      />
    </div>
  );
};
