import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

declare global {
  function findChildComponent<T extends string = string>(
    container: React.ReactElement<ContainerProps> | null,
    childType: React.ElementType,
    testID?: T,
  ): React.ReactElement | null;
}

global.findChildComponent = function findChildComponent<
  T extends string = string,
>(
  container: React.ReactElement<ContainerProps> | null,
  childType: React.ElementType,
  testID?: T,
): React.ReactElement | null {
  if (!container) {
    return null;
  }
  if (React.isValidElement(container) && 'children' in container.props) {
    const children: React.ReactNode[] = Array.isArray(container.props.children)
      ? (container.props.children as React.ReactNode[])
      : [container.props.children];

    for (const child of children) {
      if (React.isValidElement(child)) {
        if (child.type === childType) {
          if (testID !== undefined) {
            if ('testID' in child.props) {
              const props = child.props as {testID: string};
              if (props.testID === testID) {
                return child;
              }
            }
          } else {
            return child;
          }
        }

        if (React.isValidElement<ContainerProps>(child)) {
          const nestedChild = findChildComponent(child, childType, testID);
          if (nestedChild) {
            return nestedChild;
          }
        }
      }
    }
  }

  return null;
};
