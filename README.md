# Circuit Solver  :))  ***Short your time, we open your answer***

[![Documentation Status](https://readthedocs.org/projects/ansicolortags/badge/?version=latest)](http://ansicolortags.readthedocs.io/?badge=latest)
[![PyPI license](https://img.shields.io/pypi/l/ansicolortags.svg)](https://pypi.python.org/pypi/ansicolortags/)
[![Open Source Love png1](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Generic badge](https://img.shields.io/badge/contributions%3F-welcome-<COLOR>.svg)](https://shields.io/)

**Have you ever fed up of solving complicated circuits with lots of bridges and pillars ?**

*Fret Not!! You have then reached the right place, this is a computer aided software, that solves you any kind of resistive circuit instantly in no pain.*

## Features

* Flexibility to design and simulate any kind of resistive circuit.
* Can edit the circuit the circuit at any instant of time.
* Option to save the circuit that you have built, as a PNG file.
* The internal algorithm, itself does all the node planning.
* The cool feature of Undo/Redo and a delete option to efficiently use the canvas for deisgning the circuits.
* You can analyze any kind of resistive circuit.
* This can solve complicated circuits with any of the controlled sources too. 
* Easy to handle user interface as simple as drag and drop.

## Working principle
We have algorithmically implemented the technique of ***Modified Nodal Analysis (MNA)*** for solving any kind of resistive circuit. MNA is an advanced version of the existing principle of nodal analysis, in which some changes are made so as to implement it using any computer program. This is our complete implementation of circuit solver, wherein the user can simply drag the components from the design palette on the editor tab. Once you have bought in all the components start making all the connections by connecting the ports. Once done in making the connections start the simulator and you get the results instantly.

## Instructions
Computer is the foolest thing in the world, which blindly just processes the inputs that is being fed into it. Hence here are few basic instructions that must be followed while using this software. The UI is very much simple and it is completely a drag and drop kind of feature in the canvas.


  1. Drag and drop the elements from the left to the canvas
  2. Double click the element to rotate 90 degrees
  3. Connection of ports:
      - Click the ports from each element one after the other, it automatically connects (OR)
      - You can drag from one port and drop to the destination port(doesnt work on mobile browser)
  4. Double click the element Label to edit the value
  5. To name the node is optional unless there are controlling sources since we need to identify where controlling factor flows. After simulation, node numbering is automatically done to all the nodes.


## Back-story
We are currently in our sophomore year of study and have a course on electric circuits. When we first en-countered some large complicated circuits felt very hard to solve it by hand, since it involved large number of rigorous calcuations. So we just thought at that point of time that it would have been better if there were some software that would help us solve the circuit. So, we did a basic research of the avaialable softwares that help us to simulate the circuit. After our research we found that there are few such but their user interfaces aren't as good. In the similar way there are certain online tools that do provide solutions for some simple circuits without involving any controlled sources. After this research we came to knew about MNA (Modified Nodal Analysis) and its powerfull advantage being simpler to implement using a computer software, and then we started working from sratch on how to develop an end-end project, proposed a plan and then implemented it.

## Implementation
Frameworks used:
  1. [Draw2d.js](http://www.draw2d.org/draw2d/)
  2. [math.js](https://mathjs.org/)
  3. [Bootstrap](https://getbootstrap.com/)
  
 Website built using Github Pages
## Future Goals
Our next future goal is to bring in the analog circuits into the basket and provide the users a flexible way of simulating any kind of circuits. There is a limiation of only Resistive circuits can be solved using this, we intent to bring in the memory elements such as the capacitors and the inductors very soon. 
Our ultimate goal is to bring in OCR, where the user takes a snap of the circuit and the machine trys to ndrstand most of it and then give the user a choice of editing the circuit before simulating. Sounds exciting, if you wish to collabrate or have any idea please contact us through linkedin.

## Contributions
We do welcome any kind of contributions, feel free to fork it and create a pull requests. Whenever you find any kind of bugs in the code or any optimization in the code feel free to contribute to us. 

## Disclaimer
This is a computer aided software and hence there is no gaurentee by the developers for ensuring the creditability of the results that the software outputs. Though the softare has been tested against a large number of custom inputs, there are situations where it can fail. If you come across any such problem, please feel free to rise a issue here or provide your feedback in the website and we will try to address the issue as soon as possible.
