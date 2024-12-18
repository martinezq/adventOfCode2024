import sys
from math import floor

def run_wrapper(parse_func, run_func, options):
    """
    A simple wrapper function to mimic `U.runWrapper`.
    
    Args:
        parse_func: Function to parse input.
        run_func: Function to execute logic.
        options: Options dictionary (unused).
    """
    lines = sys.stdin.read().strip().split('\n')
    parsed = parse_func(lines)
    result = run_func(parsed)
    print(result)

def log(*args):
    """ A placeholder function for `U.log`. """
    print(*args)

def parse(lines):
    regs = [int(x.split(': ')[1]) for x in lines[:3]]
    program = list(map(int, lines[4].split(': ')[1].split(',')))
    return {
        'regs': regs,
        'program': program
    }

def run(parsed):
    regs = parsed['regs']
    program = parsed['program']
    best_op = 0

    def execute_with_a(init):
        nonlocal best_op
        a = init
        b = regs[1]
        c = regs[2]
        out = []
        op = 0

        def decode_operand(o):
            if o <= 3:
                return o
            return {4: a, 5: b, 6: c}.get(o, None)

        def operation_0(o, co, p):
            nonlocal a
            a = a // 2**co
            return p + 2

        def operation_1(o, co, p):
            nonlocal b
            b = b ^ o
            return p + 2

        def operation_2(o, co, p):
            nonlocal b
            b = co % 8
            return p + 2

        def operation_3(o, co, p):
            return o if a != 0 else p + 2

        def operation_4(o, co, p):
            nonlocal b
            b = b ^ c
            return p + 2

        def operation_5(o, co, p):
            nonlocal op
            out.append(co % 8)
            if program[op] != co % 8:
                return -1
            op += 1
            return p + 2

        def operation_6(o, co, p):
            nonlocal b
            b = a // 2**co
            return p + 2

        def operation_7(o, co, p):
            nonlocal c
            c = a // 2**co
            return p + 2

        operations = {
            0: operation_0,
            1: operation_1,
            2: operation_2,
            3: operation_3,
            4: operation_4,
            5: operation_5,
            6: operation_6,
            7: operation_7,
        }

        p = 0
        while p < len(program):
            if b < 0 or c < 0:
                raise ValueError("error")

            cmd = operations.get(program[p])
            co = decode_operand(program[p + 1])
            if cmd:
                p = cmd(program[p + 1], co, p)
                if p < 0:
                    if op > best_op:
                        best_op = op
                        log(oct(init), init, op)
                    return False
            else:
                raise ValueError("Unknown operation " + str(program[p]))
        return op == len(program)

    ast = 0
    while True:
        a = 8 ** 9 * ast + 0o66160522621633
        if execute_with_a(a):
            return a
        ast += 1

if __name__ == "__main__":
    run_wrapper(parse, run, {
        'hideRaw': True,
        'hideParsed': False
    })
