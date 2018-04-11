/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
   
    "use strict";
/** STEP 1 INTERFACES
/*  this interface defines the basic view models used for drawing.
/* I'll use d3 to actually render things as it's part and parcel of powerBI.)*/ 
 /**
 * Interface for Navigation viewmodel.
 *
 * @interface
 * @property {reportPage[]} pages                set of report pages or dash pages - 
                                             essentially this control renders the names and links
                                             and tracks current selection. report pages can have child pages       
   @property {string} selected */
   
   interface navigationViewModel {
        pages:   reportPage[];
        default: string;
    };


 /**
 * Interface for BarChart data points.
 *
 * @interface reportPage
 * @property {string} url    - Data value for point.
 * @property {string} label  - Coresponding category of data value.
 */
    interface reportPage {
        id:      string;
        url:     string;
        label:   string;
        children: string[];
    };

 /** NOw stub data. not sure where we would get this data except 
     for inlining it as its not clear powerBI surfaces this data*/

  let reportList: reportPage[] = [
    {
        id:    "hpage",
        url:    "https://jeremyepstein.com",
        label:  "homepage",
        children: []
    },
    {
        id:    "newspage",
        url:    "https://nytimes.com",
        label:  "the times",
        children: []
    }
    ]

   /** now populate viewmodel*/
   let viewModel: navigationViewModel = {
       pages: reportList,
       default: "hpage"
   } 




    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;
            if (typeof document !== "undefined") {
                const new_p: HTMLElement = document.createElement("p");
                new_p.appendChild(document.createTextNode("Update count:"));
                const new_em: HTMLElement = document.createElement("em");
                this.textNode = document.createTextNode(this.updateCount.toString());
                new_em.appendChild(this.textNode);
                new_p.appendChild(new_em);
                this.target.appendChild(new_p);
            }
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            console.log('Visual update', options);
            if (typeof this.textNode !== "undefined") {
                this.textNode.textContent = (this.updateCount++).toString();
            }
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}