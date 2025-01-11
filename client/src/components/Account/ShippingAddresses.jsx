import { Button } from "../ui";
import { BadgePlus } from "lucide-react";
import { AddressCard } from "./AddressCard";
import { DeleteAddressDialog } from "./DeleteAddressDialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const ShippingAddresses = ({
  addresses,
  onDelete,
  handleDeleteClick,
  showDeleteDialog,
  setShowDeleteDialog,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);

  return (
    <div className="address-container">
      <h2 className="text-3xl font-sf-heavy font-bold mb-4">
        Shipping Addresses
      </h2>
      <Button
        type="submit"
        className="w-52 rounded-none mt-2.5 mb-5 font-sf-light text-xs uppercase bg-dark-primary text-light-primary hover:bg-dark-secondary hover:shadow-lg  transition-all duration-300"
        onClick={() => navigate("/add-address")}
      >
        <span className="flex items-center justify-center">
          Add a new address
          <BadgePlus className="ml-2 mb-1 h-4 w-4" />
        </span>
      </Button>

      <div className="flex flex-col w-full">
        {addresses?.length > 0 ? (
          addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={(id) => onNavigate(`/edit-address/${id}`)}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <p>No addresses found</p>
        )}
      </div>

      <DeleteAddressDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleDeleteAddress={onDelete}
        setAddressToDelete={setSelectedAddress}
      />
    </div>
  );
};
