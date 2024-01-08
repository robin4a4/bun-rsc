declare global {
    namespace JSX {
      interface ElementType {
        (props: any): Promise<React.ReactElement> | React.ReactElement;
      }
    }
   }