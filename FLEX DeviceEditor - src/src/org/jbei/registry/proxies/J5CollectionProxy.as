package org.jbei.registry.proxies
{
    import mx.controls.Alert;
    
    import org.jbei.registry.Notifications;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.models.j5.J5Collection;
    import org.puremvc.as3.patterns.proxy.Proxy;
    
    public class J5CollectionProxy extends Proxy
    {
        public static const NAME:String = "J5CollectionProxy";
        
        public function J5CollectionProxy()
        {
            super(NAME, null);
        }
        
        public function get j5Collection():J5Collection
        {
            return data as J5Collection;
        }
        
        //TODO: remove when center canvas goes away
        public function addItem(j5Collection:J5Collection):void
        {
            data = j5Collection;
        }
        
        public function createCollection(numBins:int):void
        {
            if (data != null) {
                Alert.show("Collection already exists", "Error Message");
                return;
            }
            
            data = new J5Collection();
            
            for (var i:int = 0; i < numBins; i++) {
                addBin("No_Name" + i);
            }
        }
        
        public function deleteItem():void
        {
            data = null;
        }
        
        public function isInCollection(part:Part):Boolean
        {
            if (data == null) {
                return false;
            }
            
            var bin:J5Bin;
            for (var i:int = 0; i < j5Collection.binCount(); i++) {
                bin = j5Collection.binsVector[i];
                for (var j:int = 0; j < bin.binItemsVector.length; j++) {
                    if (part == bin.binItemsVector[j]) {
                        return true;
                    }
                }
            }
            return false;
        }
        
        public function isCollectionCircular():Boolean
        {
            return j5Collection.isCircular;
        }
        
        public function setCollectionCircular(b:Boolean):void
        {
            j5Collection.isCircular = b;
        }
        
        public function addBin(name:String, index:int = -1):J5Bin
        {
            if (j5Collection == null) {
                throw new Error("No collection exists. Cannot add bin");
            }
            
            var j5Bin:J5Bin = new J5Bin(name);
            
            if (index != -1) {
                j5Collection.binsVector.splice(index, 0, j5Bin);
            } else {
                j5Collection.binsVector.push(j5Bin);
            }
            
            sendNotification(Notifications.NEW_BIN_ADDED, index);
            
            return j5Bin;
        }
        
        public function deleteBin(index:int):void
        {
            if (j5Collection == null) {
                throw new Error("No collection exists. Cannot delete bin");
            }
            
            if (index != -1) {
                j5Collection.binsVector.splice(index, 1);
            } else {
                j5Collection.binsVector.pop();
            }
        }
        
        public function getBinIndex(bin:J5Bin):int
        {
            for (var i:int = 0; i < j5Collection.binsVector.length; i++) {
                if (bin == j5Collection.binsVector[i]) {
                    return i;
                }
            }
            return -1;
        }
        
        /**
         * Adds the part to the bin specified by binIndex at the position specified, 
         * or to the end of the bin if no position specified
         * 
         * @param part      the part to add to the bin
         * @param binIndex  the index of the bin in which to add the part
         * @param position  the position within the bin at which to add the part
         */
        public function addToBin(part:Part, binIndex:int, position:int = -1):void
        {
            if (position == -1) {
                j5Collection.binsVector[binIndex].binItemsVector.push(part);
            } else {
                j5Collection.binsVector[binIndex].binItemsVector.splice(position, 0, part);
            }
        }
        
        /**
         * Removes the part from the bin specified by binIndex. If the part is 
         * not in the bin specified, nothing is removed. 
         * 
         * @param part      the part to remove from the bin
         * @param binIndex  the index of the bin from which to remove the part
         */
        public function removeFromBin(part:Part, binIndex:int):void
        {
            var partIndex:int = j5Collection.binsVector[binIndex].binItemsVector.indexOf(part);
            if (partIndex != -1) {
                j5Collection.binsVector[binIndex].binItemsVector.splice(partIndex, 1);
            }
        }
        
        /** 
         * Determines the j5Bin the part is in
         * 
         * @param part  the part for which to determine the j5Bin
         * 
         * @return      the j5Bin the part is in, or null if the part is not in a collection
         */
        public function getBinAssignment(part:Part):J5Bin
        {
            for (var binNum:int = 0; binNum < j5Collection.binsVector.length; binNum++) {
                var bin:J5Bin = j5Collection.binsVector[binNum];
                for (var i:int = 0; i < bin.binItemsVector.length; i++) {
                    if (part == bin.binItemsVector[i]) {
                        return bin;
                    }
                }
            }
            return null;
        }
    }
}