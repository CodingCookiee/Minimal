import { Button } from "../ui";
import { Pencil, Trash2 } from "lucide-react";

export const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div key={address._id} className="p-4">
      <div className="">
        <div key={address._id} className=" p-4 ">
          {address.isDefault && (
            <span className=" text-xl font-sf-heavy font-bold  py-1 mb-2 inline-block">
              Default
            </span>
          )}
          <p className="font-sf-light  text-neutral-600">{address.name}</p>
          <p className="font-sf-light   text-neutral-600 mt-1">
            {address.address1}
          </p>
          <p className="font-sf-light   text-neutral-600">{address.address2}</p>
          <div className="flex justify-start gap-2.5 mt-1">
            <p className="font-sf-light   text-neutral-600">{address.city}</p>
            <div className="mt-1 h-[15px] border-[0.5px] border-neutral-500"></div>

            <p className="font-sf-light   text-neutral-600 ">
              {address.country}
            </p>
          </div>
          <div className="flex justify-start gap-2.5 mt-1">
            <p className="font-sf-light    text-neutral-600">
              {address.postalCode}
            </p>
            <div className="mt-1 h-[15px] border-[0.5px] border-neutral-500"></div>

            <p className="font-sf-light   text-neutral-600">{address.phone}</p>
          </div>

          <div className="flex justify-start gap-2.5 mt-4">
            <Button
              type="button"
              className="font-extralight text-lg p-0"
              onClick={() => onEdit(address._id)}
            >
              <span className="flex items-center justify-center">
                Edit
                <Pencil className="ml-2 mb-1 h-4 w-4" />
              </span>
            </Button>
            <Button
              type="button"
              className="font-extralight text-lg p-0 ml-8"
              onClick={() => onDelete(address._id)}
            >
              <span className="flex items-center justify-center">
                Delete
                <Trash2 className="ml-2 mb-1 h-4 w-4" />
              </span>
            </Button>
          </div>
          <div className="mt-2.5 border-[0.5px] border-neutral-500"></div>
        </div>
      </div>
    </div>
  );
};
