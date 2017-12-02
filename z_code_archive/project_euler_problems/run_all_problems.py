# coding=utf-8

"""
This module, run_all_problems.py, will run all the problems and make sure they run under a minute.
"""

from project_euler_problems.problems.problem_001 import ImplementedProblem as p001
from project_euler_problems.problems.problem_002 import ImplementedProblem as p002
from project_euler_problems.problems.problem_003 import ImplementedProblem as p003
from project_euler_problems.problems.problem_004 import ImplementedProblem as p004
from project_euler_problems.problems.problem_005 import ImplementedProblem as p005
from project_euler_problems.problems.problem_006 import ImplementedProblem as p006
from project_euler_problems.problems.problem_007 import ImplementedProblem as p007
from project_euler_problems.problems.problem_008 import ImplementedProblem as p008
from project_euler_problems.problems.problem_009 import ImplementedProblem as p009
from project_euler_problems.problems.problem_010 import ImplementedProblem as p010
from project_euler_problems.problems.problem_011 import ImplementedProblem as p011
from project_euler_problems.problems.problem_012 import ImplementedProblem as p012
from project_euler_problems.problems.problem_013 import ImplementedProblem as p013
from project_euler_problems.problems.problem_014 import ImplementedProblem as p014
from project_euler_problems.problems.problem_015 import ImplementedProblem as p015
from project_euler_problems.problems.problem_016 import ImplementedProblem as p016
from project_euler_problems.problems.problem_017 import ImplementedProblem as p017
from project_euler_problems.problems.problem_018 import ImplementedProblem as p018
from project_euler_problems.problems.problem_019 import ImplementedProblem as p019
from project_euler_problems.problems.problem_020 import ImplementedProblem as p020
from project_euler_problems.problems.problem_021 import ImplementedProblem as p021
from project_euler_problems.problems.problem_022 import ImplementedProblem as p022
from project_euler_problems.problems.problem_023 import ImplementedProblem as p023
from project_euler_problems.problems.problem_024 import ImplementedProblem as p024
#from project_euler_problems.problems.problem_025 import ImplementedProblem as p025
#from project_euler_problems.problems.problem_028 import ImplementedProblem as p028

#from project_euler_problems.problems.problem_031 import ImplementedProblem as p031
#from project_euler_problems.problems.problem_076 import ImplementedProblem as p076

#from project_euler_problems.problems.problem_050 import ImplementedProblem as p050
#from project_euler_problems.problems.problem_035 import ImplementedProblem as p035

#from project_euler_problems.problems.problem_030 import ImplementedProblem as p030
#from project_euler_problems.problems.problem_038 import ImplementedProblem as p038
#from project_euler_problems.problems.problem_039 import ImplementedProblem as p039

from project_euler_problems.problems.problem_041 import ImplementedProblem as p041

#from project_euler_problems.problems.problem_044 import ImplementedProblem as p044

#from project_euler_problems.problems.problem_048 import ImplementedProblem as p048

#from project_euler_problems.problems.problem_050 import ImplementedProblem as p050
#from project_euler_problems.problems.problem_052 import ImplementedProblem as p052
#from project_euler_problems.problems.problem_052 import ImplementedProblem as p053
#from project_euler_problems.problems.problem_067 import ImplementedProblem as p067
#from project_euler_problems.problems.problem_081 import ImplementedProblem as p081

#from project_euler_problems.problems.problem_092 import ImplementedProblem as p092


all_problems = [p001(), p002(), p003(), p004(), p005(), p006(), p007(), p008(), p009(), p010(),
                p011(), p012(), p013(), p014(), p015(), p016(), p017(), p018(), p019(), p020(),
                p021(), p022(), p023(), p024(), p041()]

#p048()

#for i, problem in enumerate(all_problems):
#	print(str(i + 1) + ' | ' + str(problem.get_run_time()) + ' | ' + str(problem.get_solution()))

p = all_problems[-1]
print(p)



