// ActionScript file
// Author: Doug Densmore

package org.jbei.registry
{
    import mx.charts.chartClasses.StackedSeries;

        public final class Notifications
        {
                public static const INITIALIZATION:String = "Initialization";
                public static const APPLICATION_FAILURE:String = "ApplicationFailure";
                
                //public static const SELECTION_CHANGED:String = "SelectionChanged";
                
                //public static const INIT_ICONS:String = "InitIcons";
                //public static const ICON_RESIZED:String = "IconResized";
                //public static const ICON_DELETED:String = "IconDeleted";
                //public static const ICON_MOVED:String = "IconMoved";
                //public static const ICON_SAVED:String = "IconSaved";
                //public static const CHANGE_ICON:String = "ChangeIcon";
                
                //public static const COLLECTION_SELECTED:String = "CollectionSelected";
                //public static const COLLECTION_RESIZED:String = "CollectionResized";
                //public static const COLLECTION_MOVED:String = "CollectionMoved";
                //public static const COLLECTION_SAVED:String = "CollectionSaved";
                public static const COLLECTION_MODIFIED:String = "CollectionModified";
                
                //public static const SHAPE_DELETED:String = "ShapeDeleted";
                
                public static const GENBANK_FETCHED:String = "GenBankFetched";
                public static const GENBANK_MAPPED:String = "GenBankMapped";
                //public static const NO_GENBANK_FOUND:String = "NoGenBankFound";
                
                public static const LOGIN:String = "Login";
                public static const LOGOUT:String = "Logout";
                            
				public static const ENTRY_FETCHED:String = "EntryFetched";
                
                public static const SEQUENCE_FETCHED:String = "SequenceFetched";
                public static const SEQUENCE_MAPPED:String = "SequenceMapped";
                public static const NO_SEQUENCE_FOUND:String = "NoSequenceFound";
                
                //public static const COPY:String = "Copy";
                //public static const PASTE_SHAPE:String = "PasteShape";
                //public static const SELECT_ALL:String = "SelectAll";
                //public static const KEY_PRESSED:String = "KeyPressed";

                public static const FIND_MATCH_FOUND:String = "FindMatchFound";
                public static const FIND_MATCH_NOT_FOUND:String = "FindMatchNotFound";
                
                //public static const SHOW_PROPERTIES_DIALOG:String = "ShowPropertiesDialog";
                //public static const SHOW_J5_DIALOG:String = "ShowJ5Dialog";
                //public static const SHOW_EUGENE_DIALOG:String = "ShowEugeneDialog";
                //public static const SHOW_HELP_DIALOG:String = "ShowHelpDialog";
                //public static const SHOW_REGISTRY_DIALOG:String = "ShowRegistryDialog";
                
                public static const SHOW_MAPPING_BAR:String = "ShowMappingBar";
                public static const HIDE_MAPPING_BAR:String = "HideMappingBar";
                
                //public static const GENBANK_IMPORT_START:String = "GenbankImportStart";
                //public static const FASTA_IMPORT_START:String = "FastaImportStart";
                
                public static const IMPORT_FETCHED:String = "ImportFetched";
                //public static const IMPORT_SET:String = "ImportSet";
                //public static const IMPORT_SEQ_FILE:String = "ImportSeqFile";
                //public static const IMPORT_PART_FILE:String = "ImportPartFile";
                //public static const IMPORT_TARGET_FILE:String = "ImportTargetFile";
                //public static const IMPORT_ZIPPED_FILE:String = "ImportZippedFile";
                
                public static const LOAD_XML:String = "LoadXML";
                //public static const LOADJ5:String = "LoadJ5";
                public static const LOAD_FETCHED:String = "LoadFetched";
                //public static const SAVE:String = "Save";
                
                public static const CHANGE_TITLE:String = "ChangeTitle";
                
                //public static const SEQ_FILE_FETCHED:String = "SeqFileFetched";
                //public static const PART_FILE_FETCHED:String = "PartFileFetched";
                //public static const TARGET_FILE_FETCHED:String = "TargetFileFetched";
                //public static const ZIPPED_FILE_FETCHED:String = "ZippedFileFetched";

                //public static const MAP_ENTRY:String = "MapEntry";
                public static const PART_STATUS_CHANGED:String = "PartStatusChanged";
                //public static const EXPORT_PART_XML:String = "ExportPartXML";
                //public static const SET_J5:String = "SetJ5";
                //public static const DELETE_SHAPE:String = "DeleteShape";
                
                //TODO: all notification constants after refactoring start with NEW_, should clean this up at some point
                
                public static const NEW_ADD_RECT_SHAPE:String = "AddRectShape";
                public static const NEW_LEFT_CANVAS_COLLECTION_CLICKED:String = "LeftCanvasCollectionClicked";

                public static const NEW_OPEN_J5IMPORT_DIALOG:String = "OpenJ5ImportDialog";
                public static const NEW_GENBANK_IMPORT_START:String = "GenbankImportStart";
                public static const NEW_CLIPBOARD_PASTE_START:String = "ClipboardPasteStart";

                public static const NEW_REFRESH_ALL_RECT_SHAPES:String = "RefreshAllRectShapes";
                public static const NEW_CLEAR_DISPLAY_INFO:String = "ClearDisplayInfo";
                public static const NEW_UPDATE_PART_DISPLAY_INFO:String = "UpdatePartDisplayInfo";
                public static const NEW_UPDATE_COLLECTION_DISPLAY_INFO:String = "UpdateCollectionDisplayInfo"
                public static const NEW_UPDATE_STATUS_BAR_BASIC:String = "UpdateStatusBar";
                
                public static const NEW_OPEN_CHANGE_ICON_DIALOG:String = "OpenChangeIconDialog";
                public static const NEW_CHANGE_ICON:String = "NewChangeIcon";
                
                public static const NEW_SAVE_XML:String = "SaveXML";
                
                public static const NEW_CLEAR_DESIGN:String = "ClearDesign";
                
                public static const NEW_SHOW_J5_DIALOG:String = "ShowJ5Dialog";
                
                public static const NEW_LOAD_SLIC_EXAMPLE:String = "LoadSlicExample";
                public static const NEW_LOAD_COMBINATORIAL_SLIC_EXAMPLE:String = "LoadCombinatorialSlicExample";
                public static const NEW_LOAD_GOLDEN_GATE_EXAMPLE:String = "LoadGoldenGateExample";
                public static const NEW_LOAD_COMBINATORIAL_GOLDEN_GATE_EXAMPLE:String = "LoadCombinatorialGoldenGateExample";
                
                public static const NEW_IMPORT_EUGENE_RULES:String = "ImportEugeneRules";
                public static const NEW_EUGENE_RULE_ADDED_DELETED:String = "EugeneRuleAddedOrDeleted";
                
                public static const NEW_CHECK_BIN_FAS:String = "CheckBinFas";
                
                public static const NEW_UPDATE_J5_PARAMETERS:String = "UpdateJ5Parameters";
                
                public static const NEW_REFRESH_LINKED_PART_RENDERERS:String = "RefreshLinkedPartRenderes";
                public static const NEW_REFRESH_ALL_PART_RENDERERS:String = "RefreshAllPartRenderers";
                
                public static const NEW_BIN_ADDED:String = "BinAdded";
                public static const NEW_BIN_DELETED:String = "BinDeleted";
                
                public static const NEW_MEDIATORS_REGISTERED:String = "MediatorsRegistered";
                
                public static const NEW_UPDATE_BIN_NAME:String = "UpdateBinName";
                public static const NEW_UPDATE_DSF_LINES:String = "UpdateDSFLines";
                
                public static const NEW_SET_CLIPBOARD_DATA:String = "SetClipboardData";
                
                public static const NEW_CUT:String = "Cut";
                public static const NEW_COPY:String = "Copy";
                public static const NEW_PASTE:String = "Paste";
                public static const NEW_CLEAR:String = "Clear";
                
                public static const NEW_SET_FOCUS_ON_SELECTED:String = "SetFocusOnSelected";
        }
}

