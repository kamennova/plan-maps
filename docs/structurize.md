**Structurizing nodes algorythm**

Parameter: array of objects consisting of node container id (null for stage) and node object.

Variables: \
**`allNodes`** - array of nodes,\
**`innerNodes`** - array of nodes (excluding stages) which don't contain any of `allNodes`. All step nodes are inner.

Before start, allNodes = input parameter, innerNodes = [].

1. Iterate through `allNodes`: if node is inner, move it from `allNodes` to `innerNodes`.
2. Insert each of `innerNodes` to its container(s) from `allNodes`.
3. If `innerNodes` are empty, it means only top nodes (stages) are left in `allNodes`. 
Else clear `innerNodes` & go to step 1.


Example.

Consider structure of 14 nodes (2 stages 12 inner nodes). 

Iteration 1: All steps are marked at once in the first iteration

<pre>
id  type     containerId   is inner   
----------------------------------    
1   step     3             + 
2   step     3             +
3   branch   4              
4   stage    -
5   step     5             +
6   stage    -
7   step     6             +
8   branch   6
9   branch   6             +
10  step     8             +    
11  branch   8
12  branch   11
13  step     12            +
14  step     12            +
</pre>

Iteration 2:

<pre>
id  type     containerId   is inner   
----------------------------------    
3   branch   4             +
4   stage    -
6   stage    -
8   branch   6
11  branch   8
12  branch   11            +
</pre>

Iteration 3:

<pre>
id  type     containerId   is inner   
----------------------------------    
3   branch   4             +
4   stage    -
6   stage    -
8   branch   6
11  branch   8
12  branch   11            +
</pre>

Iteration 4:

<pre>
id  type     containerId   is inner   
----------------------------------    
4   stage    -
6   stage    -
8   branch   6
11  branch   8             +
</pre>

Iteration 5:

<pre>
id  type     containerId   is inner   
----------------------------------    
4   stage    -
6   stage    -
8   branch   6             +  
</pre>

Iteration 6: Final, `innerNodes` array is empty and `allNodes` consists of stages only.

<pre>
id  type     containerId   is inner   
----------------------------------    
4   stage    -
6   stage    -  
</pre>
