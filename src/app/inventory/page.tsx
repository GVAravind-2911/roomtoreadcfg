import React from 'react';
import InventoryTable from '../../components/InventoryTable';

const InventoryPage: React.FC = () => {
    return (
        <div>
            <h1>Inventory Page</h1>
            <p>Here you can view all available items in the inventory.</p>
            <InventoryTable />
        </div>
    );
};

export default InventoryPage;